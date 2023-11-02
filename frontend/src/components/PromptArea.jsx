import axios from 'axios';
import React, { useState } from 'react';
import { BsSend } from 'react-icons/bs';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function PromptArea({ onSearch }) {
  const [query, setQuery] = useState('');

  const validationSchema = Yup.object({
    query: Yup.string().required('Query is required!'),
  }); 

  const initialValues = {
    query: '',
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuerySend = async (values) => {
    try {
      const query = values.query
      const response = await axios.post('http://neosaas.net/api/invoke-endpoint/', values);
      const response_payload = response.data["response-payload"]
      await axios.post('http://neosaas.net/api/create-conversation-object', {response_payload, query})
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-600 p-4 rounded-md h-28 my-4 shadow-md mx-9 flex">
      <Formik onSubmit={handleQuerySend} validationSchema={validationSchema} initialValues={initialValues}>
      {() => (
        <Form className='w-full rounded h-full inline-flex'>
          <Field
            name="query"
            className="border p-2 w-full rounded dark:bg-slate-600 h-full" 
            component='textarea' 
            placeholder="Input Prompt..." 
          ></Field>
          <ErrorMessage name='query' component='Field' className="text-red-500 text-lg ml-3 mt-3" />
          <button type='submit' className='bg-black dark:bg-slate-300 w-20 flex items-center justify-center h-auto p-4 rounded-lg relative hover:scale-105 hover:transform hover:duration-300 transform duration-300 text-white dark:text-black text-xs'>
            <BsSend size={30}/>
          </button>
        </Form>
      )}
      </Formik>  
    </div>
  );
}

export default PromptArea;
