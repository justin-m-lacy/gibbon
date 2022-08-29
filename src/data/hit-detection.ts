
import Component from '../core/component';
import { Grid } from './grid';
import { Collider2d } from '../components/collider2d';
import { GameEvents } from '../events/game-events';
import { Transform } from '../core/transform';
/**
 * Wraps quadtree to give access to geometric testing.
 */
export class HitDetection extends Component {


    /**
     * underlying quadtree that provides collision tests.
     */
    //private tree: Quadtree<Indexable>;

    /**
     * Properties used for creating quadtree.
     */
    //private treeProps: QuadtreeProps;

    private grid: Grid<Collider2d>;

    private _transform!: Transform;

    /**
     * 
     * @param props
     * @param props.parent - parent whose children with collider2ds are detected for collisions.
     * @param props.width
     * @param props.height
     */
    constructor(props: {

        width: number, height: number,

    }) {

        super();

        this.grid = new Grid({ width: props.width, height: props.height });

        /*if (!tree) {
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

        }*/

    }

    init() {

        // Find initial colliders.

        this._transform = this.actor!.transform;

        const colliders = this._transform.findInChildren(Collider2d);
        for (let i = colliders.length - 1; i >= 0; i--) {
            this.grid.addItem(colliders[i]);
        }

        this.actor!.on(GameEvents.ChildAdded, this.childAdded, this);
        this.actor!.off(GameEvents.ChildRemoved, this.childRemoved, this);
        this.actor!.on(GameEvents.ActorDestroyed, this.childRemoved, this);


    }

    childAdded(t: Transform) {

        const collider = t.get(Collider2d);
        if (collider) {
            this.grid.addItem(collider);
        }
    }

    /**
     * Update collider's position in grid.
     * @param collider 
     */
    updateItem(collider: Collider2d) {

        this.grid.removeItem(collider);
        this.grid.addItem(collider);

    }

    childRemoved(t: Transform) {

        const collider = t.get(Collider2d);
        if (collider) {
            this.grid.removeItem(collider);
        }
    }

    addCollider(collider: Collider2d) {

        //this.tree.insert(obj);
        this.grid.addItem(collider);

    }

    removeCollider(collider: Collider2d) {

        this.grid.removeItem(collider);
    }

    update(delta: number) {

        /**
         * Updating Positions: In future might actually detect changes in colliders themselves?
         */
        for (const child of this._transform) {

            const collider = child.get(Collider2d);
            if (collider && !collider.isStatic) {
                this.grid.removeItem(collider);
                this.grid.addItem(collider);
            }
        }

        const hitResults: Array<Collider2d> = [];

        for (const child of this._transform) {

            const collider = child.get(Collider2d);
            if (collider) {

                hitResults.length = 0;
                this.grid.getHits(collider, hitResults);

                if (hitResults.length > 0) {
                    collider.actor!.emit(GameEvents.Collision, collider, hitResults);
                }


            }

        }

    }

}