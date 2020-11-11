const fauna = require('faunadb')
const q = fauna.query
const dotenv = require('dotenv')
dotenv.config()
const { ApolloServer, gql } = require('apollo-server-lambda')
const adminClient = new fauna.Client({secret:process.env.FAUNA_KEY})

const typeDefs = gql`
type BookMark{

  Bookmarkdata:String!
}
input AddBookmark{
  text:String!,
  url:String!
}
input Deletebookmark{
  ref:String!
}
input Updatebookmark{
  text:String!,
  url:String!,
  ref:String!
}
type Mutation{
  addBookmark(input:AddBookmark):BookMark!,
  deleteBookmark(input:Deletebookmark):BookMark!
  updateBookmark(input:Updatebookmark):BookMark!
}
 type Query {

  Data:[BookMark!]
 }
`


const resolvers = {
  Query: {

      Data:async()=>{
        
        const result = await adminClient.query(
         q.Map(
          q.Paginate(q.Documents(q.Collection('BookMarkApp'))),
          q.Lambda(x=>q.Get(x))
         )
        )
        const value = await JSON.stringify(result);
        const finadaata = [{Bookmarkdata:value}]

        return finadaata
      }
  },
  Mutation:{
    addBookmark:async(e,{input})=>{

      const result = await adminClient.query(
        q.Create(
          q.Collection('BookMarkApp'),
          {data:{text:input.text,url:input.url}}
        )
      )

      return {Bookmarkdata:'Success'}
    },
    deleteBookmark:async(e,{input})=>{

      const result = await adminClient.query(

        q.Delete(
          q.Ref(q.Collection('BookMarkApp'),input.ref)
        )
      )
      return {Bookmarkdata:"Success"}
    },
    updateBookmark:async(e,{input})=>{

      const result = await adminClient.query( 
        
        q.Update(
          q.Ref(q.Collection('BookMarkApp'),input.ref),
          {data:{text:input.text,url:input.url}}
        )
      )

      return {Bookmarkdata:"Success"}

    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
