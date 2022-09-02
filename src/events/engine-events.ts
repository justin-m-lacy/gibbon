import type { Actor } from '../core/actor';
import { Collider2d } from '../components/collider2d';
import { Component } from '../core/component';
import { DisplayObject } from 'pixi.js';
import EventEmitter from 'eventemitter3';
import { EventNames } from 'eventemitter3';


/**
 * Ensure string|symbol events are converted to { [string]:(EventListener)} format.
 */
export type EventObject<E extends EventEmitter.ValidEventTypes> = E extends string | symbol ? Record<E, EventEmitter.EventListener<E, EventNames<E>>> : E;


export type CombineEvents<E1 extends EventEmitter.ValidEventTypes, E2 extends EventEmitter.ValidEventTypes> = EventObject<E1> & EventObject<E2>;

export type UnionEmitter = EventEmitter<CombineEvents<GameEvents, string | symbol | object>>;


/**
 * Core GameEvents emitted and used by the system.
 */
export enum EngineEvent {
    ActorDestroyed = 'destroy',
    ComponentDestroyed = 'destroyComponent',
    ChildAdded = 'addChild',
    ChildRemoved = 'removeChild',
    Collision = 'collision'

}

export type GameEvents = {

    [EngineEvent.ActorDestroyed]: (actor: Actor) => void,
    [EngineEvent.ComponentDestroyed]: (comp: Component<any>) => void,
    [EngineEvent.ChildAdded]: <T extends DisplayObject>(actor: Actor<T>) => void;
    [EngineEvent.ChildRemoved]: (actor: Actor<DisplayObject>) => void;
    [EngineEvent.Collision]: (collider: Collider2d, hits: Collider2d[]) => void;


}