import Header from './Header';
import Content from './Content';
import Footer from './Footer';
import { useState , useEffect} from "react"
import AddItem from './AddItem';
import SearchItem from './SearchItem';
import apiRequest from './apiRequest';

function App() {
  const API_URL='http://localhost:35000/items'

  const [items, setItems] = useState( "" ||[]);
  const [search, setSearch]=useState('')
  const [newItem, setNewItem] =useState('')
  const [fetchError, setFetchError] =useState(null)
  const [isLoading, setIsLoading] =useState(true)

  useEffect(()=>{    

    const fetchItems = async () => {
      try{
        const response = await fetch(API_URL)
        if(!response.ok) throw Error('Did not received expected data')
        const listItems=await response.json()
        //console.log(listItems)
        setItems(listItems)
        setFetchError(null)
      }
      catch(err){
        //console.log(err.stack)
        setFetchError(err.message)
      }finally{
        setIsLoading(false)
      }
    }
    setTimeout(()=>{
      (async()=> await fetchItems())();
    },2000)
    //fetchItems()
  },[])
  


  const setAndSaveItems=(newItems)=>{
    setItems(newItems)
    //localStorage.setItem('shoppingList', JSON.stringify(newItems) )
  }

  const addItem=async (item)=>{
    const id=items.length?items[items.length-1].id +1 : 1
    const myNewItem={id,checked:false,item}
    const listItems=[...items,myNewItem]
    setAndSaveItems(listItems)

    const postOptions={
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(myNewItem)
    }
    const result = await apiRequest(API_URL,postOptions)
    if(result) setFetchError(result)
  }

  const handleSubmit=(e)=>{
    e.preventDefault()
    if(!newItem)return
    //console.log(newItem)
    addItem(newItem)
    setNewItem('')
  }

  const  handleCheck = async (id)=>{
    const listItems=items.map((item)=>{
        return item.id===id? {...item,checked: !item.checked}:item
    })
    setAndSaveItems(listItems)

    const myItem= listItems.filter((item) => item.id === id)
    const updateOptions={
      method:'PATCH',
      headers:{
        'Content-Type':'application/json'
      },
      body: JSON.stringify({checked:myItem[0].checked})
    }
    const reqUrl= `${API_URL}/${id}`
    const result = await apiRequest(reqUrl,updateOptions)
    if(result) setFetchError(result)
  }

  const handleDelete=async (id)=>{
    const listItems=items.filter((item)=>{
        return item.id !== id
    })
    setAndSaveItems(listItems)

    const deleteOptions={
      method:'DELETE'
    }
    const reqUrl= `${API_URL}/${id}`
    const result = await apiRequest(reqUrl,deleteOptions)
    if(result) setFetchError(result)
  }

  return (
    <div className="App">
      <Header title="Groceries list"></Header>
      <AddItem 
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      ></AddItem>
      <SearchItem
        search={search}
        setSearch={setSearch}
      ></SearchItem>
      <main>
        {isLoading && <p>Loading items...</p>}
        {fetchError && <p style={{color:'red'}}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading &&<Content 
          items={items.filter((item)=>((item.item).toLowerCase()).includes(search.toLowerCase()) )} 
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        ></Content>}
      </main>
      <Footer
      length={items.length} 
      ></Footer>
    </div>
  );
}

export default App;
