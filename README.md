# sequelize-typescript-paginate

[![npm version](https://img.shields.io/npm/v/sequelize-typescript-paginate.svg)](https://www.npmjs.com/package/sequelize-typescript-paginate)
[![Coverage Status](https://coveralls.io/repos/marianozunino/sequelize-typescript-paginate/badge.png)](https://coveralls.io/r/marianozunino/sequelize-typescript-paginate)

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
