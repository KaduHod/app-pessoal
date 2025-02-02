package financas

/*
Objeto que ira processar dados de structs responsaveis por calcular investimento
*/
type TIPO_INVESTIMENTO_ENUM int
const (
    JC_SEM_APORTE TIPO_INVESTIMENTO_ENUM = iota
    JC_COM_APORTE_MENSAL
    JC_COM_APORTE_MENSAL_E_VALOR_INICIAL
)
type AnalizarResultadoInvestimentoDeJurosComposto struct {
    JcService SimularJurosComposto
    tipoInvestimento TIPO_INVESTIMENTO_ENUM `json: "tipo_investimento" form:"tipo_investimento"`
    resultadoInvestimento float64 `json:"resultado_investimento" form:"resultado_investimento"`
    retornoSobreOInvestimento float64 `json:"retorno_sobre_o_investimento" form:"retorno_sobre_o_investimento"`
    dadosTabelaPorMes map[string]map[string]float64
}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) SetTipoInvestimento(tipo TIPO_INVESTIMENTO_ENUM) {
    self.tipoInvestimento = tipo
}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) GetTipoInvestimento() TIPO_INVESTIMENTO_ENUM {
    return self.tipoInvestimento
}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) SetValorFinal(resultado float64) {
    self.resultadoInvestimento = resultado
}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) GetValorFinal() float64 {
    return self.resultadoInvestimento
}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) GetDiferencaRetorno(valor_inicial float64) float64 {
    return self.GetValorFinal() - valor_inicial
}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) SetRetornoSobreOInvestimento(valor_inicial float64) {
    self.retornoSobreOInvestimento = (self.resultadoInvestimento / valor_inicial) * 100
}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) GetRetornoSobreOInvestimento() float64 {
    return self.retornoSobreOInvestimento
}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) SetUpDadosTabelaResultadoPorMes() {

}
/*Até 180 dias: 22,5%
181 a 360 dias: 20%
361 a 720 dias: 17,5%
Acima de 720 dias: 15%*/
func (self *AnalizarResultadoInvestimentoDeJurosComposto) SetImpostoDeRenda() {}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) SetEstaProtegidoPeloFGC() {}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) SetTaxaInflacao() {}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) SetRetornoSobreInflacao() {}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) SetRetornoSobreIR() {}
func (self *AnalizarResultadoInvestimentoDeJurosComposto) SetValorReal() {}

