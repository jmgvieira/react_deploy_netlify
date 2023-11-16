import ItemList from './ItemList'
const Content = ({items, handleCheck, handleDelete}) => {

    return (
    <>
        {items.length ? (
            <ItemList 
                items={items} 
                handleCheck={handleCheck}
                handleDelete={handleDelete}
            ></ItemList>
        ) : (
            <p style={{margintop:'2rem'}}>Your list is empty</p>
        )}
    </>
    )
}

export default Content
