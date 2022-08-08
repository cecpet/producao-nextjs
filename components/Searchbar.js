import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Button } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/material/';
import moment from 'moment';
import axios from 'axios';


export default function SearchBar(props) {
    let nomeProdutos = [];
    let codigoProdutos = [];
    let estoqueProdutos = [];
    const [produtos, setProdutos] = useState(null);
    const [quantidade, setQuantidade] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [data, setData] = useState(null);
    const [maquina, setMaquina] = useState('');
    const [codigo, setCodigo] = useState('');
    const [estoque, setEstoque] = useState('');
    const [id, setId] = useState(0);
    const [rows, setRows] = useState(() => {
        if (typeof window !== "undefined") {
            let rowsStorage = localStorage.getItem('rows');
            const initialRows = JSON.parse(rowsStorage) || [];
            if (rowsStorage) {
                return [initialRows];
            };
        }
    });
    

    useEffect(() => {
        fetch("https://bling.com.br/Api/v2/produtos/json&estoque=S&apikey=8020092b209846d21012501e7e9dfcd71d29550e79beb439e9a0023b872037e99085fdaf")
        .then(response => response.json())
        .then(data => {
            setProdutos(data.retorno.produtos);
        })
    }, [])


    if(produtos !== null) {
        produtos.forEach(item => {
            let produtoNome = item.produto.descricao;
            let produtoCodigo = item.produto.codigo;
            let produtoEstoque = item.produto.estoqueAtual;
            nomeProdutos.push(produtoNome);
            codigoProdutos.push(produtoCodigo);
            estoqueProdutos.push(produtoEstoque);
        });
    }

    function handleData(newData){
        setData(newData);
    };

    let produtoProduzido = {};

    function handleQuantidade(event){
        setQuantidade(event.target.value);
    }

    function handleAdd(){
        if(inputValue === '' || data == null || quantidade === '' || maquina === ''){
            alert('Preencha todos os campos');
        } else {

            console.log(localStorage.getItem('rows'));
            setId(id=> id + 1);
            produtoProduzido = {
                produto: inputValue,
                quantidade: quantidade,
                data: moment(data).format('YYYY-MM-DD'),
                maquina: maquina,
                id: id,
                codigo: codigo,
                estoque: estoque,
             }
            props.addProduto(produtoProduzido);
            console.log(estoqueProdutos)
            setInputValue('');
            setQuantidade('');
            setData(null);
            setMaquina('');
        }
    }

  return (
    <Box component="form" sx={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
    }}>
        <Autocomplete
            disablePortal
            aria-required="true"
            id="combo-box-demo"
            options={nomeProdutos} 
            sx={{ width: 300 }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
                setCodigo(() => codigoProdutos[nomeProdutos.indexOf(newInputValue)]);
                setEstoque(() => estoqueProdutos[nomeProdutos.indexOf(newInputValue)]);
            }}
            renderInput={(params) => <TextField {...params} label="Produtos" />}
        />
        <TextField id="outlined-basic" type="number" label="Quantidade" variant="outlined" value={quantidade} onChange={handleQuantidade}/>
        <LocalizationProvider dateAdapter ={AdapterDateFns}>
        <DatePicker
          required  
          label="Data"
          inputFormat="dd/MM/yyyy"
          value={data}
          onChange={handleData}
          renderInput={(params) => <TextField {...params} />}
        />
        </LocalizationProvider>
        <FormControl>
    <FormLabel id="demo-radio-buttons-group-label">Máquina</FormLabel>
    <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        aria-required="true"
        name="radio-buttons-group"
        value={maquina}
        onChange={(event, newMaquina) => {
            setMaquina(newMaquina);
        }}
    >
        <FormControlLabel value="MG120" control={<Radio />} label="MG120" />
        <FormControlLabel value="MG200" control={<Radio />} label="MG200" />
    </RadioGroup>
    </FormControl>
    <Button variant="contained" onClick={handleAdd}>Adicionar</Button>
    </Box>
    
  );
}

