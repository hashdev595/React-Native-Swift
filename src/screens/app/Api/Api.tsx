import { View, Text } from 'react-native'
import React,{useEffect} from 'react'

const Api = () => {

useEffect(()=>{
    const getApi = () => {
        try {
            fetch('https://jsonplaceholder.typicode.com/posts')
            .then(res => res.json())
            .then((resJson) => console.log('res',resJson))
        } catch (error) {
            console.log(error)
            const err = error
        }
    }
    getApi()
},[])



  return (
    <View style={{marginTop:100}}>
    
      <View>
      <Text>Api</Text>
      </View>
      <View>
        <Text>text</Text>
      </View>
    </View>
  )
}

export default Api