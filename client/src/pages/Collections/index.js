import { useEffect, useState, useRef } from "react";
import useScrollPosition from "@react-hook/window-scroll";
import MainLayout from 'layouts/Main';
import Collection from "components/collection";
import Footer from 'components/Footer';
import { ReactComponent as Search } from 'assets/svg/search.svg'
import categories from "data/categories";
import ApiController from 'utils/ApiController';
import './_style.scss';

export default function CollectionsPage () {

    const scrollY = useScrollPosition(60);
    const [ page, setPage ] = useState(1);
    const [ totalPage, setTotalPage ] = useState(1);
    const [ collections, setCollections ] = useState([]);

    const searchTermRef = useRef(null)
    const categoryRef = useRef(null)
    const typeRef = useRef(null)

    const [ term, setTerm ] = useState('')
    const [ category, setCategory ] = useState('')
    const [ type, setType ] = useState('')

    useEffect(() => {
        if (totalPage === page || scrollY === 0) {
          return;
        }
    
        if (document.body.clientHeight - scrollY - window.innerHeight < 700) {
          setPage(page + 1);
        }
    
    }, [scrollY]);
    
    useEffect(() => {
        async function fetchCollections() {
            const apiController = new ApiController();
            apiController.get(`/collection?
                page=${page}
            `).then(response => response.data)
                .then(data => {
                    console.log('data = ',data)
                    if(data.result == 'failed') {
                        setCollections([...collections])
                    } else {
                        setTotalPage(data.totalPage)
                        setCollections([...collections, ...data.data])
                    }
                })
                .catch((e) => console.log(e));
        }
    
        fetchCollections()
    
        return () => {
        }
    }, [page]);

    const searchCollection = () => {
        // setCollections([])
        setTerm(searchTermRef.current.value)
        setCategory(categoryRef.current.value)
        setType(typeRef.current.value)
        // const data = { term, category, type }
        // const apiController = new ApiController();
        // apiController.post('/collection', data)
        //     .then(response => response.data)
        //     .then(data => {
        //     console.log(data)
        //     if(data.result == 'failed') {
        //         setCollections([...collections])
        //     } else {
        //         // setTotalPage(data.totalPage)
        //         setCollections(data.data)
        //     }
            
        //     })
        //     .catch((e) => console.log(e));
    }

    return (
    <MainLayout>
        <div className='hero-section flex flex-col items-center justify-center px-10 mb-12'>
           <h1 className='hero-headline'>Browse our collection</h1>
           <p className='hero-text'>You can search for unlimited learning products in our collection of e-books, audiobooks, assignments, case studies, and more. If you are missing something, let us know, and we will create it for you.</p>
        </div>
        <div className='search-section mx-24 py-4 px-24 mb-16'>
            <div className='search_bar flex items-center p-2'>
                <div className='flex flex-grow items-center justify-between'>
                    <input className='flex-grow ml-9' name='search_term' placeholder='Start typing...' ref={searchTermRef} />
                    <div className='v-line mx-4'></div>
                    <select defaultValue={""} ref={categoryRef} >
                        <option value="" disabled hidden>Select in all categories</option>
                        {
                            categories.map((category, idx) => (
                                <option key={idx} value={category}>{category}</option>
                            ))
                        }
                    </select>
                    <div className='v-line mx-4'></div>
                    <select defaultValue={""} ref={typeRef} >
                        <option value="" disabled hidden>Select in all types</option>
                        <option value="ebook">E-Book</option>
                        <option value="audio">Audio-Book</option>
                        <option value="assignments">Assignments</option>
                        <option value="casestudy">Case Studies</option>
                        <option value="scans">Scans</option>
                        <option value="podcast">Podcast</option>
                    </select>
                    <div className='v-line mx-4'></div>
                    
                </div>
                <div className='flex items-center'>
                    <span className='search_letter px-6'>Search</span>
                    <button className='ml-4' onClick={() => {
                        searchCollection()
                    }}>
                        <Search />
                    </button>
                </div>
            </div>
        </div>
        <div className="collection-list-section grid grid-cols-5 gap-8 justify-center px-7 mb-52">
            {
                collections.map((collection, idx) => (
                    <Collection key={idx} data={collection} />
                ))
            }
        </div>
        <Footer />
    </MainLayout>
    )
}