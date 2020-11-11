
export interface Bookmark{
    data:[{
        data:{
            text:string,
            url:string
        },
        ref:{
            '@ref':{
                id:string,
                collection:{}
            }
        }
    }]
  }