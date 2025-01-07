import { QueryParams } from "src/types/query.params";
import { ObjectId } from "mongodb";


export default class QueryTool {



    static getFilter({filters}:QueryParams ){
        const ands = [];
        const ors = [];
        const operators = ['eq', 'ne', 'gt', 'lt', 'in', 'gte', 'lte'];
        const junctions = ['and', 'or'];
        if(!filters || filters.length === 0){
            return {};
        }
        if(!Array.isArray(filters)){
            filters = [filters];
        }
        for(let i=0; i<filters.length; i++){
            const filter = filters[i];
            const [field, originalValue, operator='eq', junction='and'] = filter.split(':');
            let value = originalValue;
            if(field.endsWith('id') || field.endsWith('Id')){
                value = new ObjectId(originalValue) as unknown as string;
            }
            if(operators.includes(operator) && junction && junctions.includes(junction)){
                if(junction === 'and'){
                    ands.push({[field]: {[`$${operator}`]: value}});
                } else if(junction === 'or'){
                    ors.push({[field]: {[`$${operator}`]: value}});
                }
            }
        }
        if(ors.length > 0){
            return {
                $and: [
                    ...ands,
                    {$or: ors}
                ],
            }
        } 
       
        return  ands.reduce((acc, cur) => {
            return {...acc, ...cur};
        }, {});
        
    }

    static getSearch({search}:QueryParams ){
        if(!search){
            return {};
        }
        return {$text: {$search: search}}
    }

    static getSort({sortBy, sortOrder}:QueryParams ){
        if(!sortBy){
            return {};
        }
        return {[sortBy]: sortOrder==='desc'?-1:1}
    }

}