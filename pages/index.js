import Head from 'next/head'
import SearchBar from "../components/Searchbar";
import { supabase } from "../lib/supabaseClient";
import  { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import { toXML } from 'jstoxml';

export default function Home() {
  
  const [produto, setProduto] = useState([]);
  const [rowsDeletadas, setRowsDeletadas] = useState([]);


  const addProduto = (item) => {
    setProduto([...produto, item]);
  }

  const columns = [
    {field: 'id', headerName: 'ID', width: 100},
    {field: 'produto', headerName: 'Produto', width: 300, editable: true},
    {field: 'quantidade', headerName: 'Quantidade', width: 120, editable: true},
    {field: 'data', headerName: 'Data', width: 200, editable: true},
    {field: 'maquina', headerName: 'Maquina', width: 150, editable: true},
  ];


  const rows = [...produto];


  useEffect(() => {
    if(produto.length > 0){
      localStorage.setItem('rows', JSON.stringify(rows))
    }
  }, [produto])

  useEffect(() => {
    const rows = JSON.parse(localStorage.getItem('rows'));
    if(rows) {
      setProduto(rows);
    }
  }, [])


  function enviarProdutos(){
    rows.forEach(item => {

      let qntd = parseInt(item.quantidade);
      let estoque = parseInt(item.estoque);
      let estoqueAtual = estoque + qntd;

      let produtoXML= {
        produto: {
          codigo: item.codigo,
          descricao: item.produto,
          estoque: estoqueAtual,
      }
    }

      
      let xml = toXML(produtoXML);
      console.log(xml);

      fetch(`https://bling.com.br/Api/v2/produto/${item.codigo}/json&estoque=S&apikey=bdb022ba4d05d05a2b152b04843dc465ef6df0a543ddb2152fc87379aa37d7e697cd62c6&xml=${xml}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      })
      .then(response => response.json())
      .catch(error => console.log(error));
      
      async function insertProdutos(){
        const { data, error } = await supabase
        .from('produtos')
        .insert(
          {
            produto: item.produto,
            qntd: item.quantidade,
            data: item.data,
            maquina: item.maquina,
          },
          { returning: 'minimal' }
        )
        console.log(error, data)
  
       }
        insertProdutos();
    })
    
    localStorage.clear();
    window.alert('Produtos enviados com sucesso!');



  }

  const handleRowsSelected = (rows) => {
    
  }
  return (
    <div>
      <Head>
        <title>Produção - Cec Pet</title>
        <meta name="description" content="Produção Cec Pet" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Cec Pet - Produção</h1>
      <SearchBar addProduto={addProduto} />
      <Box sx={{
        height: 350,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}>
        <DataGrid 
        columns={columns} 
        rows={produto}
        experimentalFeatures={{ newEditingApi: true }}
        checkboxSelection={true}
        rowSelection={true}
        rowSelectionMode={'multiple'}
        onRowSelected={handleRowsSelected(rows)}
        />
      </Box>
      <Box sx={{
        textAlign: 'right',
        padding: '.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <Button variant="contained">Deletar Selecionados</Button>
        <Button onClick={enviarProdutos} variant="contained">Enviar</Button>
      </Box>
     
    </div>
  )
}
