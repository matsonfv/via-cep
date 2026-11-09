// Arquivo: App.js

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';

export default function App() {
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [carregando, setCarregando] = useState(false);

  const buscarCep = async (cepDigitado) => {
    const valor = (cepDigitado || '').replace(/\D/g, '');

    if (!valor || valor.length !== 8) {
      setEndereco('Digite um CEP válido com 8 números.');
      return;
    }

    setCarregando(true);
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${valor}/json/`);
      const dados = await resposta.json();

      if (dados.erro) {
        setEndereco('CEP não encontrado.');
      } else {
        setEndereco(dados.logradouro || 'CEP encontrado, mas sem logradouro.');
      }
    } catch {
      setEndereco('Ops! Não foi possível conectar à internet.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <Text style={styles.eyebrow}>CEP</Text>
        <Text style={styles.titulo}>Buscar endereço</Text>

        <TextInput
          style={styles.input}
          placeholder="Digite o CEP"
          placeholderTextColor="#8a8f98"
          keyboardType="numeric"
          value={cep}
          onChangeText={setCep}
          maxLength={8}
        />

        <TouchableOpacity style={styles.botao} onPress={() => buscarCep(cep)}>
          <Text style={styles.textoBotao}>Buscar</Text>
        </TouchableOpacity>

        {carregando ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size="small" color="#1f2937" />
            <Text style={styles.loaderText}>Consultando...</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Resultado</Text>
            <Text style={styles.textoCep}>{endereco || 'Ainda não consultado.'}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f4',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
  },
  botao: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loaderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 10,
  },
  loaderText: {
    color: '#374151',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
  },
  cardLabel: {
    fontSize: 11,
    color: '#6b7280',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  textoCep: {
    fontSize: 18,
    color: '#111827',
    lineHeight: 26,
  },
});