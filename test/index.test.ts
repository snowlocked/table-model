import { TableModel, ResponseModel } from '../src/index'
interface TestRowVO{
    id: number,
    data: number
}
const tableInstance = new TableModel({
    pageData: {
        page: 1,
        size: 10
    },
    action(data):Promise<ResponseModel<TestRowVO>> {
        const res = []
        const start = (data.page - 1) * data.size
        const end = data.page * data.size
        for(let i = start;i<end;i++){
            res.push({
                id: i+1,
                data: (i+1)*(i+1)
            })
        }
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    code: 1,
                    data: {
                        rows:res,
                        total: 100
                    },
                    message: 'success'
                })
            }, 500);
        })
    }
})

test('search list', (done)=>{
    expect(tableInstance.loading).toBe(true);
    expect(tableInstance.rows.length).toBe(0);
    // console.log(tableInstance.pageData)
    // expect(tableInstance.pageData.page).toBe(1)
    // done()
    setTimeout(()=>{
        expect(tableInstance.loading).toBe(false)
        expect(tableInstance.rows[0].data).toBe(1)
        expect(tableInstance.total).toBe(100);
        tableInstance.pageData.page = 2
        expect(tableInstance.loading).toBe(true)
        // done()
    }, 500)
    setTimeout(() => {
        expect(tableInstance.loading).toBe(false)
        expect(tableInstance.rows[0].data).toBe(121)
        expect(tableInstance.total).toBe(100);
        // tableInstance.pageData.page = 2
        // expect(tableInstance.loading).toBe(true)
        done()
    }, 1010)
},)