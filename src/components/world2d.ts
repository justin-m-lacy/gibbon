import Component from '../core/component';
import { Quadtree, Indexable, QuadtreeProps } from '@timohausmann/quadtree-ts';
import { Collider2d } from './collider2d';

/**
 * Wraps quadtree to give access to geometric testing.
 */
export class World2d extends Component {


    /**
     * underlying quadtree that provides collision tests.
     */
    private tree: Quadtree<Indexable>;


    /**
     * 
     * @param tree Quadtree to use or quadtree properties.
     */
    constructor(tree?: Quadtree<Indexable> | QuadtreeProps) {
        super();

        if (!tree) {
            this.tree = tree ?? new Quadtree({
                maxLevels: 5,
                maxObjects: 10,
                width: 100,
                height: 100
            });
        } else if (tree instanceof Quadtree) {
            this.tree = tree;
        } else {
            this.tree = new Quadtree(tree);

        }

    }

    addCollider(collider: Collider2d) {

        //this.tree.insert(obj);

    }

    removeCollider(collider: Collider2d) {

    }

    update(delta: number) {
    }

}