
# Plano: Painel de Administrador com Histórico Unificado

## Resumo
Criar um Painel de Administrador para ajustes manuais de estoque, unificar o histórico de todas as movimentações (entradas, saídas e ajustes) e restringir as unidades de medida para apenas "Unidade", "Pacote" e "Metro".

---

## O que será criado

### 1. Nova Tela: Painel do Administrador
- Lista todos os produtos com quantidade atual
- Permite selecionar um produto e ajustar a quantidade manualmente
- Formulário com campos obrigatórios:
  - Produto selecionado
  - Nova quantidade desejada
  - Nome do responsável pelo ajuste
- Exibe a diferença (quantidade anterior vs nova)
- Validação que impede estoque negativo

### 2. Sistema Unificado de Histórico
O histórico passará a registrar todos os tipos de movimentação:
- **Entrada**: Cadastro de novos produtos ou reposição de estoque
- **Saída**: Retiradas de materiais
- **Ajuste Administrativo**: Correções manuais feitas pelo administrador

Cada registro terá:
- Tipo de movimentação (badge colorido para fácil identificação)
- Nome do produto
- Quantidade (anterior e nova para ajustes)
- Data e hora
- Responsável pela ação

### 3. Restrição de Unidades de Medida
O campo "Unidade de medida" será limitado a apenas 3 opções:
- Unidade
- Pacote  
- Metro

---

## Navegação Atualizada

A barra lateral terá um novo item:
- Estoque (página inicial)
- Cadastrar Produto
- Registrar Saída
- **Painel Admin** (novo - com ícone diferenciado)
- Histórico (agora mostrará todas as movimentações)

---

## Validações e Segurança

| Validação | Comportamento |
|-----------|---------------|
| Estoque negativo | Bloqueia ajuste e exibe erro |
| Responsável vazio | Bloqueia ação e exibe erro |
| Unidade inválida | Campo dropdown não permite outras opções |

---

## Mensagens de Confirmação

- **Ajuste bem-sucedido**: "Estoque ajustado! [Produto] alterado de X para Y unidades."
- **Erro de validação**: "Não é possível definir quantidade negativa."

---

## Seção Técnica

### Arquivos a serem modificados:

1. **`src/types/index.ts`**
   - Criar nova interface `StockMovement` para o histórico unificado:
     ```text
     StockMovement {
       id, type (entrada|saida|ajuste), productId, productName,
       previousQuantity, newQuantity, difference,
       destination?, responsibleName, date, createdAt
     }
     ```

2. **`src/hooks/useMovements.ts`** (novo)
   - Hook para gerenciar o histórico unificado de movimentações
   - Funções: `addMovement()`, `getMovements()`

3. **`src/hooks/useProducts.ts`**
   - Adicionar função `setProductQuantity(productId, newQuantity)` para ajustes diretos

4. **`src/components/stock/ProductForm.tsx`**
   - Alterar array `UNITS` para conter apenas: `['Unidade', 'Pacote', 'Metro']`

5. **`src/components/stock/AdminAdjustmentForm.tsx`** (novo)
   - Formulário para ajustes administrativos

6. **`src/components/stock/MovementHistory.tsx`** (novo)
   - Componente para exibir histórico unificado com badges por tipo

7. **`src/pages/AdminPanelPage.tsx`** (novo)
   - Página do Painel de Administrador

8. **`src/pages/HistoryPage.tsx`**
   - Atualizar para usar o novo histórico unificado

9. **`src/pages/RegisterProductPage.tsx`** e **`src/pages/OutputPage.tsx`**
   - Integrar com o novo sistema de movimentações

10. **`src/components/layout/Sidebar.tsx`**
    - Adicionar link para o Painel Admin

11. **`src/App.tsx`**
    - Adicionar rota `/admin` para o novo painel

### Fluxo de Dados

```text
+------------------+     +-----------------+     +------------------+
|  Cadastro/       | --> | useMovements()  | --> | Histórico        |
|  Entrada         |     | addMovement()   |     | Unificado        |
+------------------+     +-----------------+     +------------------+
        |                        ^                       |
        v                        |                       v
+------------------+     +-----------------+     +------------------+
|  Saída de        | --> | tipo: entrada   |     | MovementHistory  |
|  Material        |     | tipo: saida     |     | Component        |
+------------------+     | tipo: ajuste    |     +------------------+
        |                +-----------------+
        v                        ^
+------------------+             |
|  Painel Admin    | ------------+
|  (Ajustes)       |
+------------------+
```
