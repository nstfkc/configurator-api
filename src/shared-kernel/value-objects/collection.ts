import { InvariantViolationException } from '@Shared/exceptions';
import { AbstractValueObject } from './abstract-value-object';

export class Collection<T extends AbstractValueObject> {
  private _items: { [key: string]: T } = {};
  private readonly _removed: string[];
  private readonly _updated: string[];
  private readonly _added: string[];

  /**
   * @param items
   * @param _id - Id-function to identify item of type T
   * @param _originals - Receives new item when new item is added via add/addOrReplace
   * @param added
   * @param updated
   * @param removed
   */
  constructor(
    items: T[],
    private _id: (x: T) => string,
    private _originals: { [key: string]: T } = {},
    added: string[] = [],
    updated: string[] = [],
    removed: string[] = [],
  ) {
    if (!items || !Array.isArray(items)) {
      throw new InvariantViolationException(`Can not instantiate Collection: wrong items array ${items}`);
    }
    items.forEach((item: T) => {
      if (!this.hasItem(item)) {
        /** Call private method to not mark the item as new one */
        this._addItem(item);
      }
    });
    this._removed = this._prepareKeys(removed);
    this._updated = this._prepareKeys(updated);
    this._added = this._prepareKeys(added);
  }

  static from<T extends AbstractValueObject>(items: T[] | Collection<T>, id: (x: T) => string): Collection<T> {
    if (Array.isArray(items)) {
      return new Collection<T>(items, id);
    } else {
      return new Collection<T>(items.all(), id);
    }
  }

  map<V>(method: ((x: T) => V) | string): V[] {
    return this.all().map((x) => {
      if (typeof method === 'string') {
        return (x as any)[method]();
      }
      return method(x);
    });
  }

  /**
   * После, например, сохранения в хранилище информация об изменениях коллекции перестаёт быть нужна.
   * Этот метод установит текущее состояние как состояние по умолчанию.
   */
  commitChanges() {
    this._added.length = 0;
    this._removed.length = 0;
    this._updated.length = 0;
    this._originals = Object.keys(this._items).reduce((acc: any, key) => {
      acc[key] = this.get(key);
      return acc;
    }, {});
  }

  resetChanges() {
    const originalsWithoutAdded = Object.values(this._originals)
      .map((x: T) => (this.hasAddedKey(this.buildKey(x)) ? null : x))
      .filter((x: T | null): x is T => !!x)
      .reduce((acc: any, x: T) => {
        acc[this.buildKey(x)] = x;
        return acc;
      }, {});
    this._added.length = 0;
    this._removed.length = 0;
    this._updated.length = 0;
    this._items = originalsWithoutAdded;
    this._originals = { ...originalsWithoutAdded };
  }

  clone(): Collection<T> {
    return new Collection<T>(this.all(), this._id, this._originals, this._added, this._updated, this._removed);
  }

  /**
   * Принимает на вход новое состояние коллекции.
   *  - Отсутствующие ранее в коллекции элементы добавит
   *  - Отсутствующие сейчас в новом состоянии и бывшие в коллекции ранее -- удалит
   *  - Измененныё -- обновит
   */
  sync(items: T[]) {
    this.resetChanges();
    const getNewItem = (key: string) => items.find((item: T) => this.buildKey(item) === key);
    Object.keys(this._items).forEach((key) => {
      const newItem = getNewItem(key);
      if (!newItem) {
        this.remove(key);
      }
      // newItem ? this.addOrReplace(newItem) : this.remove(key);
    });
    items.forEach((item: T) => this.addOrReplace(item));
  }

  update(item: T): this {
    const key = this.buildKey(item);
    if (!this.hasItem(item)) {
      throw new Error(`collection does not contain item ${key}`);
    }
    /** Item was added and addOrUpdated again */
    if (this.hasAddedKey(key)) {
      this._items[key] = item;
    } else {
      const original = this._originals[key];
      if (!original || !original.eq(item)) {
        this._updated.push(key);
      }
      this._items[key] = item;
    }
    return this;
  }

  addOrReplaceMany(items: T[]) {
    items.forEach(this.addOrReplace.bind(this));
  }

  addOrReplace(item: T) {
    if (this.hasItem(item)) {
      this.update(item);
    } else {
      this.add(item);
    }
  }

  add(item: T) {
    this._addItem(item);
    this._added.push(this.buildKey(item));
  }

  removeAll() {
    this.all().forEach((item: T) => this.remove(item));
  }

  remove(item: T | string) {
    const key = this.buildKey(item);
    if (this.hasKey(key)) {
      delete this._items[key];
      if (!this.isRemoved(key)) {
        this._removed.push(key);
      }
    }
  }

  restore(item: T | string) {
    const key = this.buildKey(item);
    if (!this.isRemoved(key)) {
      throw new Error(`Can not restore item collection element "${key}"`);
    }
    this._removed.splice(this._removed.indexOf(key), 1);
    this._items[key] = this._originals[key];
    if (typeof item !== 'string') {
      this.update(item);
    }
  }

  isRemoved(item: T | string): boolean {
    const key = this.buildKey(item);
    return this._removed.includes(key);
  }

  get(key: string): T | undefined {
    return this.hasKey(key) ? this._items[key] : undefined;
  }

  has(callback: (item: T) => boolean): boolean {
    return this.all().find(callback) !== undefined;
  }

  hasItem(item: T): boolean {
    return this.hasKey(this.buildKey(item));
  }

  hasKey(key: string): boolean {
    return this._items[key] !== undefined;
  }

  buildKey(item: T | string): string {
    return typeof item === 'string' ? item : this._id(item);
  }

  count(): number {
    return Object.keys(this._items).length;
  }

  all(): T[] {
    return Object.values(this._items);
  }

  keys(): string[] {
    return Object.keys(this._items);
  }

  /**
   * @internal
   */
  getRemoved(): T[] {
    return this._removed.map((key: string) => this._originals[key]).filter(Boolean) as T[];
  }

  /**
   * @internal
   */
  hasRemoved(): boolean {
    return this._removed.length > 0;
  }

  /**
   * @internal
   */
  getAdded(): T[] {
    return this._added.map((key: string) => this.get(key)).filter(Boolean) as T[];
  }

  /**
   * @internal
   */
  hasAddedItem(item: T): boolean {
    return this.hasAddedKey(this.buildKey(item));
  }

  /**
   * @internal
   */
  hasAddedKey(key: string): boolean {
    return this._added.find((x: string) => x === key) !== undefined;
  }

  /**
   * @internal
   */
  hasAdded(): boolean {
    return this._added.length > 0;
  }

  /**
   * @internal
   */
  getUpdated(): T[] {
    return this._updated.map((key: string) => this.get(key)).filter(Boolean) as T[];
  }

  /**
   * @internal
   */
  hasUpdated(): boolean {
    return this._updated.length > 0;
  }

  private _prepareKeys(keys: string[]) {
    return keys.filter((key: string, index, arr) => {
      return arr.indexOf(key) === index && this._hasOriginalItem(key);
    });
  }

  private _hasOriginalItem(key: string): boolean {
    return this._originals[key] !== undefined;
  }

  private _addItem(item: T) {
    const key = this.buildKey(item);
    if (this.hasKey(key)) {
      throw new Error(`collection already contains item ${key}`);
    }
    this._items[key] = item;
    this._originals[key] = item;
  }
}
