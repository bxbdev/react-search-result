import "./SearchBar.scss"
import { useState, useEffect, useCallback, useRef } from 'react'
import { SearchList } from '../searchlist/SearchList'

export const SearchBar = ({setUser}) => {
    const [value, setValue] = useState('')
    const [list, setList] = useState([])
    const [filterList, setFilterList] = useState([])
    const [isFocus, setIsFocus] = useState(false)

    const inputRef = useRef(null)
    const searchRef = useRef(null)

    const fetchData = useCallback(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
        .then( res => res.json())
        .then( data => {
            setList(data)
            setFilterList(data)
        })
    }, [])

    useEffect(() => {
        // init list
        fetchData()

        // click from document to close list
        document.addEventListener('mousedown', clickOutside)

        // remove mousedown event handler
        return () => {
            document.removeEventListener('mousedown', clickOutside)
        }

    }, [fetchData, isFocus, inputRef])

    // click outside to close list
    const clickOutside = (e) => {
        if (searchRef.current && !searchRef.current.contains(e.target)) {
            setIsFocus(false)
        }
    }
    
    const clear = <button className="btn clear" onClick={(e) => handleClear()}>X</button>

    // update value and list when input changes
    const handleChange = (v) => {
        setValue(v)
        handleFilter(v)
        if (v === '') return setFilterList(list)
    }

    const handleFilter = (value) => {
        // filter original list every time when input value changes
        const update = list.filter( item => item.name.toLowerCase().indexOf(value) !== -1)
        // update new result to filterList, make sure the new result is not the same as the original one
        setFilterList(update)
    }

    // clear input value
    const handleClear = () => {
        inputRef.current.value = '';
        inputRef.current.focus();
        setValue('')
    }

    // send result to parent component
    const handleResult = (user) => {
        setValue(user.name)
        setUser(user)
        setIsFocus(false)
    }

    // show list
    const handleFocus = () => {
        setIsFocus(true)
    }

    return (
        <div className="search" ref={searchRef}>
            <div className="search-bar">
                <input 
                type="text" 
                placeholder="Search name" 
                value={value}
                onFocus={() => handleFocus()}
                onChange={(e) => handleChange(e.target.value)}
                ref={inputRef}
                />
                { value ? clear : null} 
            </div>
            <SearchList className={isFocus ? "list show" : "list"} list={filterList} result={value} setResult={(e) => handleResult(e)} />
        </div>
    )
}
