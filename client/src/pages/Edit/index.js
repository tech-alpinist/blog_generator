import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import MainLayout from 'layouts/Main';
import BasicInfoGenerator from 'components/generator_info';
import PDFGenerator from 'components/generator_pdf';
import Loading from 'components/Loading';
import { GeneratorInfoProvider } from "contexts/GeneratorInfoContext";

import ApiController from 'utils/ApiController'
import img_boocademy from 'assets/boocademy_logo.png'
import img_pdf from 'assets/pdf-icon.png'
import lang from 'data/lang'
import config from 'config'
import { ReactComponent as Check } from 'assets/svg/check.svg'
import './_style.scss';

export default function GeneratorPage () {
    const { id } = useParams();
    const [ isGenerating, setIsGenerating ] = useState(false)
    const [ category, setCategory ] = useState('')
    const [ type, setType ] = useState('')
    const [ title, setTitle ] = useState('')
    const [ listingInfo, setListingInfo ] = useState('')
    const [ language, setLanguage ] = useState('en')
    const [ editors, setEditors ] = useState([])
    const [ mainPrompt, setMainPrompt ] = useState('')

    useEffect(() => {
        function fetchData() {
            const apiController = new ApiController();
            apiController
              .get(`/collection/${id}`)
              .then((response) => response.data)
              .then((data) => {
                  console.log(data)
                  if(data.result=='failed') return
                  setTitle(data.title)
                  setCategory(data.category)
                  setType(data.type)
                  setListingInfo(data.listing_info)
                  setLanguage(data.language)
                  setEditors(data.editors)
                  setMainPrompt(data.prompt)
            });
        }

        if (id) {
          fetchData()
        }

        return () => {
            setIsGenerating(false)
        }
    }, [id]);

    const downloadPDF = () => {
        setIsGenerating(true)
        const data = {
            id, 
            lang_label: lang.find(l => l.value == language).label, 
            lang_val: lang.find(l => l.value == language).value
        }
        console.log(data)
        const apiController = new ApiController();
        apiController.post("/generator/translatedpdf", data)
            .then(response => response.data)
            .then(data => {
                setIsGenerating(false)
                console.log(data)
                if(data.result=='success') {
                    const link = document.createElement('a');
                    link.download = data.path;
                    link.href = `${config.PDF_URL}/${data.path}`;
                    link.target = "_blank"
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    console.log('Download failed...')
                }
            })
            .catch(err => console.log(err))
    }

    return (
    <MainLayout>
        <GeneratorInfoProvider defaultValue={{
            title: title,
            category: category,
            contentType: type,
            language: language,
            description: mainPrompt,
            listingInfo: listingInfo,
            editors: editors
        }}>
            <div className='container mx-auto'>
                <div className='hero-section flex flex-wrap gap-16 items-center justify-center px-10 '>
                    <div className='collection flex flex-col items-center justify-between p-4'>
                        <span className='category'>{category}</span>
                        <div className='flex flex-col items-center justify-between my-12'>
                            <span className='title mb-8'>
                                {title}
                            </span>
                            <span className='type'>{type}</span>
                        </div>
                        <img className='logo' src={img_boocademy} alt='boocademy' />
                    </div>
                    <div className='collection_info flex flex-col '>
                        <h2>{title}</h2>
                        <div className='flex flex-wrap gap-8 py-8'>
                            <div className='category flex flex-grow items-center justify-start p-4'>
                                <Check />
                                <span className='ml-4'>{category}</span>
                            </div>
                            <div className='type flex flex-grow items-center justify-start p-4'>
                                <Check />
                                <span className='ml-4'>{type}</span>
                            </div>
                        </div>
                        <div className='description mb-4'>
                            {listingInfo}
                        </div>
                        <Select
                            value={lang.find(l => l.value == language)}
                            options={lang}
                            getOptionLabel={(option) => (
                                <div className='flex items-center'>
                                    <img className='lang_flag' src={option.image} alt={option.label} />
                                    <span className='lang_text'>{option.label}</span>
                                </div>
                            )}
                            styles={{
                                control: base => ({
                                    ...base,
                                    border: 0,
                                    outline: 'none',
                                    boxShadow: 'none',
                                    background: '#23263C'
                                }),
                            }}
                            components={{
                                IndicatorSeparator: () => null
                            }}
                            onChange={(newValue) => {
                                setLanguage(newValue.value)
                            }}
                        />
                        <button className='btn_download flex justify-center items-center mt-4'
                            onClick={() => {
                                downloadPDF()
                            }}
                        >
                            <span className='mr-6'>Download PDF</span>
                            <img src={img_pdf} alt='pdf' />
                        </button>
                    </div>
                </div>
                <div className='listing_info my-20 px-10'>
                    <Tabs>
                        <TabList className='tabs flex justify-center'>
                            <Tab>
                                <span>Introduction</span>
                            </Tab>
                            <Tab>
                                <span>Reviews</span>
                            </Tab>
                        </TabList>
                        <div className='content p-10'>
                            <TabPanel>
                                <div>
                                    {listingInfo}
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div>
                                    In de hedendaagse snel veranderende en onderling verbonden zakenwereld is samenwerking essentieel voor succes. Het vermogen om effectief als team te werken en de kracht van mentoring en coaching te benutten, gaat verder dan alleen financieel gewin. Dit e-book verkent de waardevolle rol van mentoring en coaching bij het bevorderen van succesvolle samenwerking en het creëren van een positieve werkomgeving.
                                    
                                    <h3>Dit e-book heeft als doel:</h3>

                                    Inzicht te bieden in de impact van mentoring en coaching op samenwerking.
                                    De doelgroep bewust te maken van de voordelen van deze benadering.
                                    Praktische tips te geven om mentoring en coaching effectief te implementeren.
                                </div>
                            </TabPanel>
                        </div>
                    </Tabs>
                </div>
                <BasicInfoGenerator />
                <PDFGenerator />
            </div>
        </GeneratorInfoProvider>
        {
            isGenerating && <Loading text='downloading...' />
        }
    </MainLayout>
    )
}