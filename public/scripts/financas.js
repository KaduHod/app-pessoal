import {dados} from './dados.js'
import { montarGrafico } from './grafico.js'
console.log({dados})
const divGraficos = document.getElementById('grafico')
const wrapperMain = document.getElementById("wrapperGraficos")
const tipoAumentoFrequenciaInput = document.getElementById('tipo-aumento-frequencia')
const valorAumentoAporte = document.getElementById('valor_aumento_aporte')
const infoPeriodo = document.getElementById('resultadoGeralInfoPeriodo')
const infoGeral = document.getElementById('resultadoGeralInfo')
function formatarData(data) {
    if (!(data instanceof Date)) {
        data = new Date(data);
    }
    const dia = String(data.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses começam do zero
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
tipoAumentoFrequenciaInput.addEventListener('input', event => {
    if(tipoAumentoFrequenciaInput.value == "false") {
        valorAumentoAporte.classList.add('hidden')
        valorAumentoAporte.value = ""
    }
    else valorAumentoAporte.classList.remove('hidden')
})
//let dados = [];
const calcular = async ({valor_inicial, tipo_frequencia_aumento_aporte, aporte_mensal, aporte_semestral, data_final, tipo_frequencia_aporte, valor_aumento_aporte}) => {
    let dataIni = new Date()
    const data_inicial = `${dataIni.getDate()}/${dataIni.getMonth() + 1}/${dataIni.getFullYear()}`
    const body = {
        valor_inicial,
        aporte_mensal,
        aporte_semestral,
        data_final: formatarData(data_final),
        tipo_frequencia_aporte,
        valor_aumento_aporte,
        data_inicial
    }
    if(tipo_frequencia_aumento_aporte && tipo_frequencia_aumento_aporte != "false") body['tipo_frequencia_aumento_aporte'] = tipo_frequencia_aumento_aporte
    const request = await fetch('/calcular-juros', {
        method: "POST",
        headers: {'content-type':'application/json'},
        body: JSON.stringify(body)
    })
    const res = await request.json();
    return request.status == 200 ? res : null;
}
const buscarValoresInput = () => {
    return [
        ...document.getElementsByTagName('input'),
        ...document.getElementsByTagName('select') ]
        .reduce((acc, item) => {
            acc[item.name] = item.type == 'number' ? parseInt(item.value) : item.value
            return acc;
    }, {})
}
document.getElementById('calcular').addEventListener('click', async event => {
//    dados = await calcular(buscarValoresInput())
    if(!dados) {
        //dados = [];
        return;
    }
    infoGeral.innerHTML = gerarResultadoInfo(dados)
    if(wrapperMain.classList.contains('hidden')) wrapperMain.classList.toggle('hidden')
})
const formatarValorMonetario = (valor) => `${(Math.floor(valor*100)/100).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
const cabecalhoTabela = titulo => `<th scope="col" class="px-6 py-3">${titulo}</th>`;
const montaCabecalhoTabela = titulos => `<tr>${titulos.map(cabecalhoTabela).join('')}</tr>`
const montaItemLinha = dado => `<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${dado}</th>`
const montaLinhaTabela = (dados) => `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">${dados.map(montaItemLinha).join('')}</tr>`
document.getElementById('dias-grafico').addEventListener('click', event => {
    if(divGraficos.classList.contains('hidden')) divGraficos.classList.toggle('hidden')
    const cabecalho = montaCabecalhoTabela(["Data", "Valorização", "Resultado"])
    const dados_ = dados.dias.reduce((acc, curr) => {
        const {data, valorizacao, resultado_com_valorizacao} = curr
        acc.push([data, formatarValorMonetario(valorizacao), formatarValorMonetario(resultado_com_valorizacao)])
        return acc
    }, [])
    const linhasTabela = dados_.map(montaLinhaTabela).join('')
    const tabela = `
        <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    ${cabecalho}
                </thead>
                <tbody>
                    ${linhasTabela}
                </tbody>
            </table>
        </div>
    `
    infoPeriodo.innerHTML = gerarResultadoInfo(dados)
    new Chart(document.getElementById('chartjs'), {
        type: 'line',
        data: {
            labels: dados.dias.map(dia => dia.data),
            datasets: [
                {
                    label: 'Valorização diaria',
                    data: dados.dias.map(dia => dia.valorizacao),
                    borderWidth: 1
                },
                {
                    label: 'Resultado',
                    data: dados.dias.map(dia => dia.resultado_com_valorizacao),
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    montarGrafico("chartjs", dados.dias.map(item => item.valorizacao), dados.dias.map(dia => dia.data));
    document.getElementById('resultadoGrafico').innerHTML = tabela
})
document.getElementById('meses-grafico').addEventListener('click', event => {
    if(divGraficos.classList.contains('hidden')) divGraficos.classList.toggle('hidden')
    const cabecalho = montaCabecalhoTabela(["Data", "Valorização", "Resultado"])
    const dados_ = dados.meses.reduce((acc, curr) => {
        const {data_inicial, data_final, valorizacao, resultado_com_valorizacao} = curr
        acc.push([`${data_inicial} - ${data_final}`, formatarValorMonetario(valorizacao), formatarValorMonetario(resultado_com_valorizacao)])
        return acc
    }, [])
    const linhasTabela = dados_.map(montaLinhaTabela).join('')
    const tabela = `
        <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    ${cabecalho}
                </thead>
                <tbody>
                    ${linhasTabela}
                </tbody>
            </table>
        </div>
    `
    new Chart(document.getElementById('chartjs'), {
        type: 'line',
        data: {
            labels: dados.meses.map(mes => mes.data_final),
            datasets: [
                {
                    label: 'Valorização',
                    data: dados.meses.map(mes => mes.valorizacao),
                    borderWidth: 1
                },
                {
                    label: 'Resultado',
                    data: dados.meses.map(mes => mes.resultado_com_valorizacao),
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    infoPeriodo.innerHTML = gerarResultadoInfo(dados)
    document.getElementById('resultadoGrafico').innerHTML = tabela
})
document.getElementById('semestres-grafico').addEventListener('click', event => {
    if(divGraficos.classList.contains('hidden')) divGraficos.classList.toggle('hidden')
    const cabecalho = montaCabecalhoTabela(["Data", "gasto", "Valorização", "Resultado"])
    const dados_ = dados.semestres.reduce((acc, curr) => {
        const {data_inicial, data_final, valorizacao, resultado_com_valorizacao, gasto} = curr
        acc.push([`${data_inicial} - ${data_final}`, formatarValorMonetario(gasto),formatarValorMonetario(valorizacao), formatarValorMonetario(resultado_com_valorizacao)])
        return acc
    }, [])
    const linhasTabela = dados_.map(montaLinhaTabela).join('')
    const tabela = `
        <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    ${cabecalho}
                </thead>
                <tbody>
                    ${linhasTabela}
                </tbody>
            </table>
        </div>
    `
    new Chart(document.getElementById('chartjs'), {
        type: 'line',
        data: {
            labels: dados.semestres.map(semestre => semestre.data_final),
            datasets: [
                {
                    label: 'Valorização',
                    data: dados.semestres.map(semestre => semestre.valorizacao),
                    borderWidth: 1
                },
                {
                    label: 'Resultado',
                    data: dados.semestres.map(semestre => semestre.resultado_com_valorizacao),
                    borderWidth: 1
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    infoPeriodo.innerHTML = gerarResultadoInfo(dados)
    document.getElementById('resultadoGrafico').innerHTML = tabela
})
document.getElementById('anos-grafico').addEventListener('click', event => {
    if(divGraficos.classList.contains('hidden')) divGraficos.classList.toggle('hidden')
    const cabecalho = montaCabecalhoTabela(["Data", "gasto", "Valorização", "Resultado"])
    const dados_ = dados.anos.reduce((acc, curr) => {
        const {data_inicial, data_final, valorizacao, resultado_com_valorizacao, gasto} = curr
        acc.push([`${data_inicial} - ${data_final}`, formatarValorMonetario(gasto),formatarValorMonetario(valorizacao), formatarValorMonetario(resultado_com_valorizacao)])
        return acc
    }, [])
    const linhasTabela = dados_.map(montaLinhaTabela).join('')
    const tabela = `
        <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    ${cabecalho}
                </thead>
                <tbody>
                    ${linhasTabela}
                </tbody>
            </table>
        </div>
    `
    infoPeriodo.innerHTML = gerarResultadoInfo(dados)
    document.getElementById('resultadoGrafico').innerHTML = tabela
})
document.getElementById('fecharGrafico').addEventListener('click', event => {
    if(!divGraficos.classList.contains('hidden')) divGraficos.classList.toggle('hidden')
})
function gerarResultadoInfo(dados) {
    return `
    <div id="resultadoGeralInfoPeriodo" class="flex w-full justify-around">
        <div class="flex flex-col">
            <span>Valorizacao:</span>
            <span>Gasto:</span>
            <span>Diferença:</span>
            <span>Valor inicial:</span>
            <span>Valor final:</span>
        </div>
        <div class="flex flex-col">
            <div class="flex justify-between">
                <span>${formatarValorMonetario(dados.valorizacao)}</span>
                <img class="w-6 h-6" src="public/images/icons8-up-64.png" alt="">
            </div>
            <div class="flex justify-between">
                <span>${formatarValorMonetario(dados.gastos)}</span>
                <img class="w-6 h-6" src="public/images/icons8-money-with-wings-48.png" alt="">
            </div>
            <div class="flex justify-between">
                <span>${formatarValorMonetario(dados.diferenca)}</span>
                <img class="w-6 h-6" src="public/images/icons8-plus-48.png" alt="">
            </div>
            <div class="flex justify-between">
                <span>${formatarValorMonetario(dados.valor_inicial)}</span>
                <img class="w-6 h-6" src="public/images/icons8-race-flag-64.png" alt="">
            </div>
            <div class="flex justify-between">
                <span>${formatarValorMonetario(dados.valor_final)}</span>
                <img class="w-6 h-6" src="public/images/icons8-money-48.png" alt="">
            </div>
        </div>
    </div>
    `;
}
