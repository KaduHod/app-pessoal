package core

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"reflect"
	"strconv"
	"strings"
	"time"
)

func FormataData(data time.Time) string {
    return data.Format("02/01/2006")
}
func HttpRequest(url string, method string, headers map[string]string, body string) (string, error) {
	// Define o método padrão como GET, caso nenhum seja passado
	if method == "" {
		method = "GET"
	}

	// Cria o payload para o corpo da requisição
	var requestBody *bytes.Reader
	if body != "" {
		requestBody = bytes.NewReader([]byte(body))
	} else {
		requestBody = bytes.NewReader(nil)
	}

	// Cria a requisição HTTP
	req, err := http.NewRequest(method, url, requestBody)
	if err != nil {
		return "", fmt.Errorf("erro ao criar a requisição: %w", err)
	}

	// Adiciona os cabeçalhos à requisição
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	// Realiza a requisição
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("erro ao realizar a requisição: %w", err)
	}
	defer resp.Body.Close()

	// Lê o corpo da resposta
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("erro ao ler a resposta: %w", err)
	}

	return string(respBody), nil
}
func ConverterJson[v any](input string, destination *v) error {
	// Verifica se o destino é um ponteiro válido
	destValue := reflect.ValueOf(destination)
	if destValue.Kind() != reflect.Ptr || destValue.IsNil() {
		return fmt.Errorf("o destino deve ser um ponteiro válido")
	}

	// Desserializa o JSON para o destino
    if err := json.Unmarshal([]byte(input), destination); err != nil {
		return fmt.Errorf("falha ao desserializar JSON para destino: %w", err)
	}

	return nil
}
func DiasNoAno(data string) (int, error) {
	partes := strings.Split(data, "/")
	if len(partes) != 3 {
		return 0, fmt.Errorf("data inválida, o formato deve ser dd/mm/yyyy")
	}
	ano, err := strconv.Atoi(partes[2])
	if err != nil {
		return 0, fmt.Errorf("ano inválido: %v", err)
	}
	if (ano%4 == 0 && ano%100 != 0) || (ano%400 == 0) {
		return 366, nil
	}
	return 365, nil
}
