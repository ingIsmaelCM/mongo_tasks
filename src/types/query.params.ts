import { ApiProperty } from "@nestjs/swagger";


export type QueryOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'in' | 'gte' | 'lte' | '';

export type QueryJuntion = 'and' | 'or' | '';

// field:value:operator:junction
export type FilterString = `${string}:${string}:${QueryOperator}:${QueryJuntion}`;

export enum SortOrder {
    asc = 'asc',
    desc = 'desc',
    undefined = ''
}


export class QueryParams {


    @ApiProperty({
        description: 'Page number',
        required: false,
        type: Number,
        default: 1
    })
    page?: number;

    @ApiProperty({
        description: 'Page size',
        required: false,
        type: Number    })
    pageSize?: number;

    @ApiProperty({
        description: 'Sort by',
        required: false,
        type: String,
        default: 'createdAt'
    })
    sortBy?: string;

    @ApiProperty({
        description: 'Sort order',
        required: false,
        enum: SortOrder,
        default: SortOrder.asc
    })
    sortOrder?: SortOrder;

    @ApiProperty({
        description: 'field:value:operator:junction',
        required: false,
        type: String,
        isArray: true,
    })
    filters?: FilterString[];

    @ApiProperty({
        description: 'Any value to search',
        required: false,
        type: String,
    })
    search?: string;

}