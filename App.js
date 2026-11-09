// Arquivo: App.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';

export default function App() {
  // 1. Estado para guardar o cep que virá da internet
  const [cep, setCep] = useState('');
  
  // 2. Estado para mostrar um "Carregando..." enquanto a internet pensa
  const [carregando, setCarregando] = useState(true);

  // 3. A função que vai até a internet buscar o dado
  const buscarCep = async (cep) => {
    setCarregando(true); // Liga o aviso de carregando
    try {
      // Fazemos a requisição para a API de cep
      const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await resposta.json();

      // Verificamos se houve algum erro na busca
      if (dados.erro) {
        setCep('CEP não encontrado.');
      } else {
        // Salvamos o texto do cep no nosso Estado
        setCep(dados.logradouro);
      }
    } catch (erro) {
      setCep('Ops! Não foi possível conectar à internet.');
    } finally {
      setCarregando(false); // Desliga o aviso de carregando
    }
  };

  // 4. O mágico useEffect! 
  // Ele chama a função buscarCep() UMA ÚNICA VEZ quando o App abre.
  useEffect(() => {
    buscarCep(cep);
  }, []); // <-- Array vazio garante que rode apenas na montagem da tela

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Buscar endereço</Text>

      {/* Renderização Condicional: Mostra a bolinha girando ou o endereço */}
      {carregando ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <View style={styles.card}>
          <Text style={styles.textoCep}>{cep}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Digite o CEP"
        keyboardType="numeric"
        value={cep}
        onChangeText={setCep}
      />

      {/* Botão extra caso o usuário queira buscar outro cep manualmente */}
      <TouchableOpacity style={styles.botao} onPress={() => buscarCep(cep)}>
        <Text style={styles.textoBotao}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
}

// Arquivo: App.js (Continuação - Estilos)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2c3e50', alignItems: 'center', justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 30 },
  card: { backgroundColor: '#ecf0f1', padding: 30, borderRadius: 15, marginBottom: 30, width: '100%', alignItems: 'center', elevation: 5 },
  textoCep: { fontSize: 20, color: '#2c3e50', fontStyle: 'italic', textAlign: 'center', lineHeight: 30 },
  botao: { backgroundColor: '#3498db', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 8 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 20, width: '100%' },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});