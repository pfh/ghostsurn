# ghostsurn

Javascript app. A tile layout method, similar to my previous [Ghost Diagrams](http://logarithmic.net/pfh/ghost-diagrams) and [Maxim Gumin](https://twitter.com/ExUtumno)'s [WaveFunctionCollapse](https://github.com/mxgmn/WaveFunctionCollapse)). The novelty here is that this app aims to find a uniformly random sample rather than only find an example. The uniformity of the randomness of is not 100% perfect, but perfection can be approached by increasing the "effort" parameter. I'm not really sure what the point of this is, but it [tickles](https://twitter.com/paulfharrison/status/1438466031488421888) at some broad ideas.

* [Take me to the app!](https://logarithmic.net/ghostsurn)

To run locally:

```
git clone https://github.com/pfh/ghostsurn.git
cd ghostsurn
python3 -m http.server
```

# Algorithm outline

Layouts are produced in raster scan order. At every step there is a probability distribution of possible layouts. We can then try to extend each layout with each possible color of pixel or shape of tile. Some of these are discarded as invalid (based on allowed pixel patterns or allowed tile adjacency). For the survivors, the specified weights are used to update the probability distribution.

Since this would result in an exponentially increasing set of possible layouts in the probability distribution, this distribution is subsampled at each step to keep its size manageable (controlled by the "effort" parameter).

## Probability distribution subsampling

Given a collection of items `0,1,...,n-1` with weights `w[i]`.

Imagine a timeline extending from 0.

For each item `i` place instances of `i` regularly on the timeline at intervals of `1/w[i]`. The first instance is placed randomly at `Math.random()/w[i]`. 

We proceed from time 0 along the timeline, observing items in chronological order. Once we've observed `effort` distinct items we will stop. The new weights are then the number of times each distinct item was observed.

(The stopping rule potentially creates a small distortion in the distribution. Other than this, selecting a random item from a subsample produced in this way is the same as selecting a random item from the original distribution.)

For example suppose we had three items with weights 1,2 and 5. We might get a timeline like this:

```
Input distribution:
    0 has weight 10
    1 has weight 5
    2 has weight 2

--timeline->
 0  0  0  0  0  0  0  0  0  0  0  0  0
     1     1     1     1     1     1
         2              2           2
         
         ^ If we subsample down to two distinct items, sampling must stop here.
         
Output distribution:
    0 has weight 3
    1 has weight 1
```


