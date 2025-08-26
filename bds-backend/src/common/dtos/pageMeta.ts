import { PageOptionsDto } from './pageOption';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.itemCount = itemCount;

    this.pageCount = Math.ceil(itemCount / pageOptionsDto.perPage) || 1;

    const skip = (pageOptionsDto.page - 1) * pageOptionsDto.perPage;
    const remaining = itemCount - skip;

    this.take = remaining > 0 ? Math.min(pageOptionsDto.perPage, remaining) : 0;
    this.hasPreviousPage = this.page > 1 && itemCount > 0;
    this.hasNextPage = this.page < this.pageCount;
  }
}
