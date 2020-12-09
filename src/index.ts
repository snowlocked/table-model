interface ResponseDataModel<T>{
    rows: T[]
    total: number
}

export interface ResponseModel<T>{
    code: number | string
    data: ResponseDataModel<T>
    message: string
}

interface TablePropsModel<T extends Object, U extends Object, V> {
    searchData?: T
    pageData?: U
    hasSearch?: boolean
    hasPage?: boolean
    action: (...args) => Promise<ResponseModel<V>>
}

export class TableModel<T extends Object, U extends Object,V> {
    private action: (...args) => Promise<ResponseModel<V>>
    private hasSearch: boolean
    private hasPage: boolean
    searchData: T = {} as T
    pageData: U = {} as U
    rows: V[] = []
    total: number = 0   
    loading: boolean = false
    constructor(data: TablePropsModel<T,U,V>){
        this.hasSearch = 'hasSearch' in data? data.hasSearch : true
        this.hasPage = 'hasPage' in data ? data.hasPage : true
        this.action = data.action
        if (this.hasSearch) {
            this.searchData = new Proxy(data.searchData || this.searchData, {
                set: (target, prop, value)=>{
                    if (target[prop]!==value){
                        target[prop] = value
                        this.getList()
                    }
                    return true
                }
            })
        }
        if(this.hasPage){
            this.pageData = new Proxy(data.pageData || this.pageData, {
                set: (target, prop, value) => {
                    if (this.hasSearch && target[prop] !== value) {
                        target[prop] = value
                        this.getList()
                    }
                    return true
                }
            })
        }
        this.getList()
    }
    async getList(data?:{T,U}){
        const searchData = this.getSearchData(data)
        this.loading = true
        try{
            const res = await this.action(searchData)
            this.rows = res.data.rows
            this.total = res.data.total
        }finally{
            this.loading = false
        }
    }
    getSearchData(data?:{T,U}){
        if(this.hasSearch){
            if(this.hasPage){
                return Object.assign({}, this.pageData, data || this.searchData)
            }else{
                return data || this.searchData
            }
        }else{
            return undefined
        }
    }
}