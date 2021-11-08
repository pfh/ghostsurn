# ghostsurn

Ghostsurn is a Javascript app. It is a tile layout method, similar to my previous [Ghost Diagrams](http://logarithmic.net/pfh/ghost-diagrams) and [Maxim Gumin](https://twitter.com/ExUtumno)'s [WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse)). The novelty here is that this app aims to find a uniformly random sample rather than only find an example. The uniformity of the randomness of is not 100% perfect, but perfection can be approached by increasing the "effort" parameter. I'm not really sure what the significance of this is, but it [tickles](https://twitter.com/paulfharrison/status/1438466031488421888) at some broad ideas.

* [Take me to the app!](https://logarithmic.net/ghostsurn)

To run locally:

```
git clone https://github.com/pfh/ghostsurn.git
cd ghostsurn
python3 -m http.server
```

# Consequences of random sampling

## Disorder triumphs over order

Since we are aiming for a random sample of layouts, if a set of tiles admits both an orderly layout (such as a regular tiling pattern) and a disordered layout, ghostsurn will overwhelmingly prefer to produce a disordered layout. This is because there are many more disordered layouts than ordered layouts.

Setting tile "weights" to something other than 1 can be used to counterbalance this. Notionally, the weight of a tile is as if the tile has some number of distinct internal states. When ghostsurn uses such a tile, some hidden disorder is notionally created. Increasing the weight of a tile that is used more heavily in an orderly layout may cause ghostsurn to start preferring the orderly layout over a disorderly one.

## Multiverses

The [Multiverse](https://logarithmic.net/ghostsurn/0.2/pixel.html#rotation=&width=30&height=60&max_memory=100000&effort=250&scale=10&pattern=10%7C10%7C0222222222201001100221100100222000110202211111222221000202222000222222200222222220222222222222222222&mask=5%7C5%7C0000001100011000000000000&pal0=%23fce94f&pal1=%23d9138a&pal2=%2312a4d9&pal3=%23000000&pal4=%23ffffff&weight0=1&weight1=1&weight2=1&weight3=1&weight4=1) example contains disorder at two levels: an outer level of triangles ("universes"), and an inner level of disorder within the triangles. The ratio of the amount of disorder possible within universes versus the number of ways universes can be arranged in the multiverse affects how large the "universes" within the "multiverse" tend to be.

The multiverse example above took some delicate fine tuning. An easy way to simulate this is using weights. For example in the [Rectangles](https://logarithmic.net/ghostsurn/0.2/tile.html#bg=%23c4a000&outlines=1&grid=0&width=15&height=20&max_memory=100000&effort=250&scale=30&tile0=1444&pal0=%23fce94f&weight0=1&tile1=1111&pal1=%2375507b&weight1=1.5) example the weight given to the purple rectangle tile "1111" determines how large the rectangles are. Since the weight is greater than 1, it is as if large rectangles contain hidden disorder that counterbalances the disorder that is possible using many small rectangles. Try tuning this weight up or down.


# Algorithm outline

Layouts are produced in raster scan order. At every step there is a probability distribution of possible layouts. We can then try to extend each layout with each possible color of pixel or shape of tile. Some of these are discarded as invalid (based on allowed pixel patterns or allowed tile adjacency). For the survivors, the specified weights are used to update the probability distribution. (In the simplest case where weights are left at their default of 1, the probability distribution is always uniform over the set of surviving layouts.)

Since this procedure would result in an exponentially increasing set of possible layouts in the probability distribution, the distribution is subsampled at each step to keep its size manageable (controlled by the "effort" parameter).

## Probability distribution subsampling

We are given a collection of items `0,1,...,n-1` with weights `w[i]`.

Imagine a timeline extending from time 0.

For each item `i` place instances of `i` regularly on the timeline at intervals of `1/w[i]`. The first instance is placed randomly at `Math.random()/w[i]`. 

We proceed from time 0 along the timeline, observing items in chronological order. We will stop just before observing `effort+1` distinct items. The new weights are then the number of times each distinct item was observed.

(The stopping rule potentially creates a small distortion in the distribution. Other than this, selecting a random item from a subsample produced in this way is the same as selecting a random item from the original distribution.)

For example suppose we had three items with weights 10, 5, and 2. We might get a timeline like this:

```
Input distribution:
    0 has weight 10
    1 has weight 5
    2 has weight 2

--timeline->
 0  0  0  0  0  0  0  0  0  0  0  0  0  0
     1     1     1     1     1     1     1
         2              2              2
          
         ^ If we subsample down to two distinct items, sampling must stop here.
         
Output distribution:
    0 has weight 3
    1 has weight 1
```


