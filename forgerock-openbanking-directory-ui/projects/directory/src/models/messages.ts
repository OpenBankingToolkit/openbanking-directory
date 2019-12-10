export interface IMessage {
  audiences: string[];
  author: string;
  content: string;
  created: string;
  expiredDate: string;
  id: string;
  notifiedUsers: string[];
  title: string;
}

export interface IMessagesResponse {
  content: IMessage[];
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      unsorted: boolean;
      sorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}
