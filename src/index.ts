import { Model } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';

type PaginationOptions = {
  page?: number;
  pageSize?: number;
} & FindOptions;

type PaginationResult<I> = {
  docs: I[];
  total: number;
  pages: number;
};

export class PaginatedModel extends Model {
  static async paginate<T extends typeof PaginatedModel, I = InstanceType<T>>(
    this: T,
    { page = 1, pageSize = 25, ...params }: PaginationOptions = {
      page: 1,
      pageSize: 25,
    },
  ): Promise<PaginationResult<I>> {
    const options = Object.assign({}, params);

    const countOptions = Object.keys(options).reduce((acc, key) => {
      if (!['order', 'attributes', 'include'].includes(key)) {
        acc[key] = options[key];
      }
      return acc;
    }, {});

    options.limit = pageSize;
    options.offset = pageSize * (page - 1);

    if (params.limit) {
      console.warn(`(sequelize-pagination) Warning: limit option is ignored.`);
    }
    if (params.offset) {
      console.warn(`(sequelize-pagination) Warning: offset option is ignored.`);
    }

    if (params.order) options.order = params.order;

    const [count, rows] = await Promise.all([this.count(countOptions), this.findAll(options)]);

    const total = options.group !== undefined ? count['length'] : count;
    const typedRows = (rows as unknown) as I[];
    const pages = Math.ceil(total / pageSize);

    return {
      docs: typedRows,
      total,
      pages,
    };
  }
}
