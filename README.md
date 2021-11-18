# Ghostsurn

Ghostsurn is a Javascript app that performs tile layout. Simple rules for which tiles or pixels can be next to each other give rise to endless complex patterns. Ghostsurn is similar to my previous [Ghost Diagrams](http://logarithmic.net/pfh/ghost-diagrams) and [Maxim Gumin](https://twitter.com/ExUtumno)'s [WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse). The novel feature of Ghostsurn is that it aims to find a uniformly random sample from the set of valid tile layouts rather than only finding an example. The uniformity of the randomness of is not 100% perfect, but perfection can be approached by increasing the "effort" parameter.

* [Take me to the app!](https://logarithmic.net/ghostsurn)

To run locally:

```
git clone https://github.com/pfh/ghostsurn.git
cd ghostsurn
python3 -m http.server
```

# App parameters

**Effort** = Size of sample pool to use. Larger values produce a better random draw, and may also let Ghostsurn lay out harder patterns.

**Expansion** = Expand the mask used to validate the layout at each step until up to this amount of memory (bytes) is used. Larger values may let Ghostsurn lay out harder patterns, may increase quality around the edges, but also may increase the startup time.

**Weights** for each tile cause the sampler to work as though the tile has this many distinct internal states (i.e. regarded as distinct when producing a uniformly random sample). Use this to fine-tune the balance of tiles used in the layout. Does not need to be a whole number.


# The importance of effort

This app aims to produce a layout drawn uniformly at random from the set of all possible valid layouts. The randomness of the draw is not 100% perfect, but perfection can be approached by increasing the "effort" parameter. Increasing the "expansion" can also help, as less effort is spent trying dead ends. 

To assess the quality of a resulting layout:

* Click and hold on the layout. If it flickers between many different layouts, especially at the top, it is a decent random sample. 

* With insufficient effort, some sets of tiles that should have rotational symmetry have a noticable directionality to them, such as forming many more vertical than horizontal lines or having features at the top of the layout not seen at the bottom.

If the quality of layouts is poor by these criteria, increase the "effort" and/or "expansion".


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


# Quality of randomness

Producing a tile layout requires making `n` choices amongst `m` tiles or colors. We can think of this as producing a word of length `n` with an alphabet of size `m`. 

We will assume the tile weights are all equal in this section.

Let's consider a series of algorithms that produce pools of valid layouts.

First, an algorithm to output all possible valid layouts:

```
Algorithm 1:

    Create a pool of words, initially containing only the empty string.
    For i in 0,1,...,n-1:
        pool <- the set of words from appending each possible tile to the end of each item in pool.
        pool <- filter pool, retaining only valid layouts.
```

This will generate an unreasonably large number of layouts. We only want a sample:

```
Algorithm 2:

    Create a pool of words, initially containing only the empty string.
    For i in 0,1,...,n-1:
        pool <- the set of words from appending each possible tile to the end of each item in pool.
        pool <- filter pool, retaining only valid layouts.
        pool <- subsample pool, keeping each item only with specified probability p[i].
```

This will output each valid layout with probability `p[0]*p[1]*...*p[n-1]`. In this sense it produces a valid random sampling. However there are some caveats:

* The layouts that are output in the pool are not independent of each other. 
* The algorithm will output different numbers of layouts each time it is run -- possibly very different numbers. 
* Because of the variability in output, the algorithm may have highly variable running time.

Suppose we then choose a random sample from the resulting pool. The quality of the random sample depends on the variability in the output pool size. Layouts that tend to be output as part of a small pool will be selected unfairly often compared to layouts that tend to be output as part of a large pool. To solve this, `p[i]` can be tuned to try to produce similar numbers of outputs each time the algorithm is run. If the pool size variability is minimized, the unfairness will be minimized. (This might require outputting very large pools.)

It would be far more practical if the algorithm could run in a fixed time. To achieve this, we can automatically tune the probability of retaining each item in the pool as the algorithm runs:

```
Algorithm 3:

    Create a pool of words, initially containing only the empty string.
    For i in 0,1,...,n-1:
        pool <- the set of words from appending each possible tile to the end of each item in pool.
        pool <- filter pool, retaining only valid layouts.
        pool <- subsample pool, keeping only some fixed number e of items.
```

This is what Ghostsurn uses. This hides the variability in output size from Algorithm 2, but doesn't eliminate the problem. Increasing the effort `e` *should* produce better random samples, but it is harder to assess the quality of samples than in Algorithm 2.

If high quality random samples are an absolute requirement, a reasonable approach might be to choose `p[i]` based and Algorithm 3, and then run Algorithm 2 many times to check the variability of the size of the output pool.

