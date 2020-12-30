# sequelize-typescript-paginate

[![npm version](https://img.shields.io/npm/v/sequelize-paginate.svg)](https://www.npmjs.com/package/sequelize-paginate)
[![npm downloads](https://img.shields.io/npm/dm/sequelize-paginate.svg)](https://www.npmjs.com/package/sequelize-paginate)
[![Build Status](https://travis-ci.org/eclass/sequelize-paginate.svg?branch=master)](https://travis-ci.org/eclass/sequelize-paginate)
[![devDependency Status](https://img.shields.io/david/dev/eclass/sequelize-paginate.svg)](https://david-dm.org/eclass/sequelize-paginate#info=devDependencies)

> Sequelize Base Model with pagination for Sequelize-Typescript
>
> Inspired on https://github.com/eclass/sequelize-paginate

## Installation

```bash
npm i sequelize-typescript-paginate
```

## Usege

```ts
import { PaginatedModel } from 'sequelize-typescript-pagination';
import { Sequelize, Column, DataType, ForeignKey, Table, HasMany } from 'sequelize-typescript';

@Table({ tableName: 'book' })
export class Book extends PaginatedModel {
  @Column({ type: DataType.STRING })
  name: string;
  @ForeignKey(() => Author)
  @Column({ type: DataType.INTEGER })
  authorId: string;
}

@Table({ tableName: 'author' })
export class Author extends PaginatedModel {
  @Column({ type: DataType.STRING })
  name: string;
  @HasMany(() => Book)
  books: Book[];
}

//...
//...
//...

// Default page = 1 and pageSize = 25
const { docs, pages, total } = await Author.paginate();
// Or with extra options
const options = {
  attributes: ['id', 'name'],
  page: 1, // Default 1
  pageSize: 25, // Default 25
  order: [['name', 'DESC']],
  where: { name: { [Op.like]: `%elliot%` } },
};
const { docs, pages, total } = await Author.paginate(options);
```

**NOTE:** _If **options** includes **limit** or **offset** they will be ignored._

## License

[MIT](https://tldrlegal.com/license/mit-license)
