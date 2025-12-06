"""
═══════════════════════════════════════════════════════════════
    ANALISADOR DE RENDA V3.3.3 - STREAMLIT
    Sistema de Análise de Extratos Bancários
    FIX: Agrupamento por dia para Apps (Uber/iFood/etc)
═══════════════════════════════════════════════════════════════
"""

import streamlit as st
import anthropic
import os
import base64
import json
from datetime import datetime
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
import PyPDF2
import io
from PIL import Image
import time
import re

# ═══════════════════════════════════════════════════════════════
# CONFIGURAÇÕES
# ═══════════════════════════════════════════════════════════════

st.set_page_config(
    page_title="Analisador de Renda - V3.3.3",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Estilo CSS customizado
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 0;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #666;
        text-align: center;
        margin-bottom: 2rem;
    }
    .success-box {
        padding: 1rem;
        background-color: #d4edda;
        border-left: 5px solid #28a745;
        border-radius: 5px;
        margin: 1rem 0;
    }
    .info-box {
        padding: 1rem;
        background-color: #d1ecf1;
        border-left: 5px solid #17a2b8;
        border-radius: 5px;
        margin: 1rem 0;
    }
    .warning-box {
        padding: 1rem;
        background-color: #fff3cd;
        border-left: 5px solid #ffc107;
        border-radius: 5px;
        margin: 1rem 0;
    }
    .stButton>button {
        width: 100%;
        background-color: #1f77b4;
        color: white;
        font-size: 1.2rem;
        padding: 0.75rem;
        border-radius: 8px;
        border: none;
        font-weight: bold;
    }
    .stButton>button:hover {
        background-color: #145a8c;
    }
    .reset-button>button {
        background-color: #6c757d !important;
    }
    .reset-button>button:hover {
        background-color: #5a6268 !important;
    }
</style>
""", unsafe_allow_html=True)

# ═══════════════════════════════════════════════════════════════
# API KEY
# ═══════════════════════════════════════════════════════════════

ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY')
if not ANTHROPIC_API_KEY:
    st.error("❌ ERRO: Variável ANTHROPIC_API_KEY não configurada!")
    st.info("Configure em Settings > Secrets no Streamlit Cloud")
    st.stop()

client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# ═══════════════════════════════════════════════════════════════
# PROMPT V3.3.3 - COM AGRUPAMENTO POR DIA
# ═══════════════════════════════════════════════════════════════

PROMPT_ANALISE = """Você é um especialista em análise de extratos bancários e de aplicativos de mobilidade/delivery para aprovação de crédito imobiliário.

# TAREFA
Analise o extrato e extraia TODAS as entradas de dinheiro (créditos/receitas), excluindo transferências entre membros da mesma família.

# TIPOS DE FONTE DE RENDA VÁLIDOS

## BANCOS TRADICIONAIS:
• PIX recebido
• TED recebido
• DOC recebido
• Transferência recebida
• Depósito
• Crédito em conta
• Salário
• Pagamento
• Rendimento

## APLICATIVOS DE MOBILIDADE:
• Ganhos Uber
• Ganhos 99
• Ganhos da 99
• Receita Uber
• Receita 99
• Transferência Uber
• Pagamento Uber

## APLICATIVOS DE DELIVERY:
• Ganhos iFood
• Ganhos Rappi
• Receita iFood
• Receita Rappi
• Pagamento iFood
• Pagamento Rappi

## BANCOS DIGITAIS:
• Entrada Digio
• Entrada PicPay
• Entrada Mercado Pago
• Recebido via Pix (qualquer banco)
• Crédito (qualquer banco digital)

# AGRUPAMENTO POR DIA (CRÍTICO PARA APPS!)

**PARA APPS DE MOBILIDADE E DELIVERY (Uber/99/iFood/Rappi):**
- AGRUPE todas as entradas do MESMO DIA
- Some os valores do dia
- Crie UMA ÚNICA entrada por dia com o total
- Descrição: "Ganhos [App] - Total do dia"

**EXEMPLO:**
Se há 40 corridas Uber no dia 25/11/2025 (R$ 10.21, R$ 7.38, R$ 10.63, etc.)
NÃO liste 40 entradas separadas
LISTE APENAS: {"data": "25/11/2025", "descricao": "Ganhos Uber - Total do dia", "valor": 295.48}

**PARA BANCOS (tradicionais e digitais):**
- Liste cada transação separadamente (não agrupe)
- Cada PIX/TED/DOC é uma entrada individual

# FILTRO DE FAMÍLIA (CRÍTICO!)

## REGRAS:
1. Compare o SOBRENOME do titular com sobrenomes nas descrições
2. EXCLUA transferências entre pessoas com mesmo sobrenome
3. Para APPS (Uber/99/iFood/Rappi): NÃO aplique filtro de família
   - Apps não mostram sobrenomes completos
   - Todas entradas de apps são válidas
4. Para BANCOS (tradicionais e digitais): SEMPRE aplique filtro

# DETECÇÃO DE TIPO DE FONTE

Identifique automaticamente se o extrato é de:
- BANCO_TRADICIONAL: Caixa, BB, Itaú, Bradesco, Santander, Sicoob, Sicredi
- BANCO_DIGITAL: Nubank, Inter, Digio, PicPay, Mercado Pago
- APP_MOBILIDADE: Uber, 99
- APP_DELIVERY: iFood, Rappi

# FORMATO DA RESPOSTA (JSON VÁLIDO)

IMPORTANTE: Responda APENAS com JSON VÁLIDO e COMPLETO. Não adicione texto antes ou depois.

{
  "tipo_fonte": "BANCO_TRADICIONAL|BANCO_DIGITAL|APP_MOBILIDADE|APP_DELIVERY",
  "entradas": [
    {
      "data": "DD/MM/AAAA",
      "descricao": "Para apps: 'Ganhos [App] - Total do dia' | Para bancos: descrição original",
      "valor": 1234.56
    }
  ],
  "resumo": {
    "total_entradas": 10,
    "valor_total": 12345.67,
    "maior_entrada": 5000.00,
    "menor_entrada": 50.00,
    "media_mensal": 4115.22
  },
  "observacoes": "Qualquer informação relevante sobre o extrato"
}

CRÍTICO:
- Retorne APENAS o JSON, sem texto antes ou depois
- JSON deve estar COMPLETO com todas as seções
- Use apenas aspas duplas
- Valores numéricos sem aspas
- Datas no formato DD/MM/AAAA
- APPS: 1 entrada por dia (agrupada)
- BANCOS: 1 entrada por transação
"""

# ═══════════════════════════════════════════════════════════════
# FUNÇÕES AUXILIARES
# ═══════════════════════════════════════════════════════════════

def extrair_texto_pdf(pdf_bytes):
    """Extrai texto de PDF"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))
        texto = ""
        for page in pdf_reader.pages:
            texto += page.extract_text() + "\n"
        return texto
    except Exception as e:
        return f"Erro ao extrair PDF: {str(e)}"

def processar_imagem(image_bytes):
    """Converte imagem para base64"""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        if image.width > 2000 or image.height > 2000:
            image.thumbnail((2000, 2000))
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()
        return base64.b64encode(img_byte_arr).decode('utf-8')
    except Exception as e:
        return None

def analisar_com_claude(conteudo, tipo_arquivo, nome_cliente, banco):
    """Analisa extrato com Claude V3.3.3 - COM STREAMING + AGRUPAMENTO"""
    
    mensagem_contexto = f"""
CONTEXTO DA ANÁLISE:
• Cliente: {nome_cliente}
• Banco/App: {banco}
• Tipo de arquivo: {tipo_arquivo}

{PROMPT_ANALISE}
"""
    
    if tipo_arquivo in ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']:
        content = [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": tipo_arquivo,
                    "data": conteudo
                }
            },
            {
                "type": "text",
                "text": mensagem_contexto
            }
        ]
    else:
        content = [
            {
                "type": "text",
                "text": f"{mensagem_contexto}\n\nEXTRATO:\n{conteudo}"
            }
        ]
    
    try:
        # STREAMING HABILITADO
        response_text = ""
        
        with client.messages.stream(
            model="claude-sonnet-4-20250514",
            max_tokens=32000,
            temperature=0,
            messages=[{
                "role": "user",
                "content": content
            }]
        ) as stream:
            for text in stream.text_stream:
                response_text += text
        
        return response_text
        
    except Exception as e:
        return f"Erro na API: {str(e)}"

def completar_json_parcial(json_parcial, entradas_encontradas):
    """Completa JSON parcial com resumo calculado"""
    try:
        # Se já tem resumo, retorna como está
        if 'resumo' in json_parcial and json_parcial['resumo']:
            return json_parcial
        
        # Calcula resumo das entradas
        if entradas_encontradas and len(entradas_encontradas) > 0:
            valores = [e.get('valor', 0) for e in entradas_encontradas if 'valor' in e]
            
            if valores:
                resumo = {
                    'total_entradas': len(entradas_encontradas),
                    'valor_total': sum(valores),
                    'maior_entrada': max(valores),
                    'menor_entrada': min(valores),
                    'media_mensal': sum(valores) / 3 if len(valores) > 0 else 0
                }
                
                json_parcial['resumo'] = resumo
        
        # Adiciona observações se não tiver
        if 'observacoes' not in json_parcial:
            json_parcial['observacoes'] = 'Análise concluída com sucesso'
        
        return json_parcial
        
    except Exception as e:
        st.warning(f"Erro ao completar JSON: {str(e)}")
        return json_parcial

def validar_e_corrigir_json(texto_resposta):
    """Valida e corrige JSON - VERSÃO MELHORADA"""
    
    # Log da resposta completa (primeiros 500 chars)
    st.info(f"📋 Resposta Claude (preview): {texto_resposta[:500]}...")
    
    texto = texto_resposta.strip()
    
    # Remove markdown
    if texto.startswith("```json"):
        texto = texto[7:]
    if texto.startswith("```"):
        texto = texto[3:]
    if texto.endswith("```"):
        texto = texto[:-3]
    texto = texto.strip()
    
    # CAMADA 1: Parse direto
    try:
        dados = json.loads(texto)
        st.success("✅ JSON válido direto!")
        return dados, None
    except json.JSONDecodeError as e:
        st.warning(f"⚠️ JSON parse falhou: {str(e)}")
    
    # CAMADA 2: Extrai JSON com regex (busca mais inteligente)
    try:
        # Procura por { ... } considerando chaves aninhadas
        matches = re.finditer(r'\{(?:[^{}]|(?:\{[^{}]*\}))*\}', texto, re.DOTALL)
        for match in matches:
            try:
                dados = json.loads(match.group())
                if 'entradas' in dados:  # Valida que é o JSON correto
                    st.success("✅ JSON extraído com regex!")
                    return dados, None
            except:
                continue
    except Exception as e:
        st.warning(f"⚠️ Regex extraction falhou: {str(e)}")
    
    # CAMADA 3: Tenta encontrar array de entradas e tipo_fonte
    try:
        tipo_match = re.search(r'"tipo_fonte"\s*:\s*"([^"]+)"', texto)
        entradas_match = re.search(r'"entradas"\s*:\s*\[(.*?)\]', texto, re.DOTALL)
        
        if tipo_match and entradas_match:
            tipo_fonte = tipo_match.group(1)
            entradas_str = entradas_match.group(1)
            
            # Tenta parsear entradas individualmente
            entradas = []
            entrada_pattern = r'\{[^}]+\}'
            for entrada_match in re.finditer(entrada_pattern, entradas_str):
                try:
                    entrada = json.loads(entrada_match.group())
                    if 'data' in entrada and 'valor' in entrada:
                        entradas.append(entrada)
                except:
                    continue
            
            if entradas:
                # Monta JSON completo
                dados_parciais = {
                    'tipo_fonte': tipo_fonte,
                    'entradas': entradas
                }
                
                # Completa com resumo calculado
                dados_completos = completar_json_parcial(dados_parciais, entradas)
                
                st.success(f"✅ JSON reconstruído! {len(entradas)} entradas encontradas")
                return dados_completos, None
                
    except Exception as e:
        st.warning(f"⚠️ Reconstrução JSON falhou: {str(e)}")
    
    # CAMADA 4: Corrige vírgulas extras e tenta de novo
    texto_limpo = texto.replace(",]", "]").replace(",}", "}")
    try:
        dados = json.loads(texto_limpo)
        st.success("✅ JSON corrigido (vírgulas extras)!")
        return dados, None
    except:
        pass
    
    # CAMADA 5: Remove quebras de linha e tenta
    texto_sem_quebras = texto.replace("\n", " ")
    try:
        dados = json.loads(texto_sem_quebras)
        st.success("✅ JSON corrigido (quebras de linha)!")
        return dados, None
    except:
        pass
    
    # FALHOU - Mostra resposta completa pra debug
    st.error("❌ Todas as camadas de validação JSON falharam!")
    with st.expander("🔍 Ver resposta completa do Claude"):
        st.code(texto_resposta, language="text")
    
    return None, f"Não foi possível extrair JSON válido após 5 tentativas"

def criar_excel_profissional(dados_json, nome_cliente, banco):
    """Cria Excel profissional"""
    
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Análise de Renda"
    
    # Estilos
    header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
    header_font = Font(bold=True, color="FFFFFF", size=12)
    subheader_fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
    subheader_font = Font(bold=True, size=11)
    border = Border(
        left=Side(style='thin'),
        right=Side(style='thin'),
        top=Side(style='thin'),
        bottom=Side(style='thin')
    )
    
    # Cabeçalho
    ws.merge_cells('A1:D1')
    ws['A1'] = "ANÁLISE DE RENDA BANCÁRIA"
    ws['A1'].font = Font(bold=True, size=16, color="FFFFFF")
    ws['A1'].fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
    ws['A1'].alignment = Alignment(horizontal='center', vertical='center')
    ws.row_dimensions[1].height = 30
    
    # Info cliente
    ws['A3'] = "CLIENTE:"
    ws['B3'] = nome_cliente
    ws['A4'] = "BANCO/APP:"
    ws['B4'] = banco
    ws['A5'] = "DATA ANÁLISE:"
    ws['B5'] = datetime.now().strftime("%d/%m/%Y %H:%M")
    ws['A6'] = "TIPO FONTE:"
    ws['B6'] = dados_json.get('tipo_fonte', 'N/A')
    
    for row in [3, 4, 5, 6]:
        ws[f'A{row}'].font = Font(bold=True)
        ws[f'B{row}'].font = Font(color="1f77b4")
    
    # Resumo
    ws['A8'] = "RESUMO FINANCEIRO"
    ws.merge_cells('A8:D8')
    ws['A8'].font = subheader_font
    ws['A8'].fill = subheader_fill
    ws['A8'].alignment = Alignment(horizontal='center')
    
    resumo = dados_json.get('resumo', {})
    ws['A9'] = "Total de Entradas:"
    ws['B9'] = resumo.get('total_entradas', 0)
    ws['A10'] = "Valor Total:"
    ws['B10'] = f"R$ {resumo.get('valor_total', 0):,.2f}"
    ws['A11'] = "Maior Entrada:"
    ws['B11'] = f"R$ {resumo.get('maior_entrada', 0):,.2f}"
    ws['A12'] = "Menor Entrada:"
    ws['B12'] = f"R$ {resumo.get('menor_entrada', 0):,.2f}"
    ws['A13'] = "Média Mensal:"
    ws['B13'] = f"R$ {resumo.get('media_mensal', 0):,.2f}"
    
    for row in range(9, 14):
        ws[f'A{row}'].font = Font(bold=True)
        ws[f'B{row}'].font = Font(color="28a745", size=11)
    
    # Tabela de entradas
    ws['A15'] = "DETALHAMENTO DAS ENTRADAS"
    ws.merge_cells('A15:D15')
    ws['A15'].font = subheader_font
    ws['A15'].fill = subheader_fill
    ws['A15'].alignment = Alignment(horizontal='center')
    
    # Headers
    headers = ['DATA', 'DESCRIÇÃO', 'VALOR', 'STATUS']
    for col, header in enumerate(headers, start=1):
        cell = ws.cell(row=16, column=col)
        cell.value = header
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = Alignment(horizontal='center', vertical='center')
        cell.border = border
    
    # Dados
    entradas = dados_json.get('entradas', [])
    for idx, entrada in enumerate(entradas, start=17):
        ws[f'A{idx}'] = entrada.get('data', '')
        ws[f'B{idx}'] = entrada.get('descricao', '')
        ws[f'C{idx}'] = f"R$ {entrada.get('valor', 0):,.2f}"
        ws[f'D{idx}'] = "✓ Válido"
        
        ws[f'C{idx}'].font = Font(color="28a745", bold=True)
        ws[f'D{idx}'].font = Font(color="28a745")
        
        for col in ['A', 'B', 'C', 'D']:
            ws[f'{col}{idx}'].border = border
            ws[f'{col}{idx}'].alignment = Alignment(vertical='center')
    
    # Observações
    if 'observacoes' in dados_json:
        obs_row = len(entradas) + 18
        ws[f'A{obs_row}'] = "OBSERVAÇÕES:"
        ws[f'A{obs_row}'].font = Font(bold=True)
        ws[f'B{obs_row}'] = dados_json['observacoes']
        ws.merge_cells(f'B{obs_row}:D{obs_row}')
    
    # Ajusta larguras
    ws.column_dimensions['A'].width = 12
    ws.column_dimensions['B'].width = 50
    ws.column_dimensions['C'].width = 15
    ws.column_dimensions['D'].width = 12
    
    # Salva
    output = io.BytesIO()
    wb.save(output)
    output.seek(0)
    return output

# ═══════════════════════════════════════════════════════════════
# INTERFACE STREAMLIT
# ═══════════════════════════════════════════════════════════════

def main():
    
    # Header
    st.markdown('<p class="main-header">📊 Analisador de Renda V3.3.3</p>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Sistema Profissional de Análise de Extratos Bancários</p>', unsafe_allow_html=True)
    
    # Sidebar - Informações
    with st.sidebar:
        st.image("https://via.placeholder.com/300x100/1f77b4/ffffff?text=Analisador+de+Renda", use_container_width=True)
        
        st.markdown("### ℹ️ Sobre o Sistema")
        st.info("""
        **V3.3.3 - Apps Agrupados**
        
        ✅ Bancos Tradicionais
        ✅ Bancos Digitais
        ✅ Apps de Mobilidade
        ✅ Apps de Delivery
        
        **Total: 15 tipos suportados!**
        
        🆕 Agrupamento por dia (Apps)
        🆕 JSON otimizado
        """)
        
        st.markdown("### 📋 Bancos Suportados")
        
        with st.expander("🏦 Bancos Tradicionais"):
            st.markdown("""
            • Caixa Econômica Federal
            • Banco do Brasil
            • Itaú
            • Bradesco
            • Santander
            • Sicoob
            • Sicredi
            """)
        
        with st.expander("💳 Bancos Digitais"):
            st.markdown("""
            • Nubank
            • Inter
            • Digio ✨
            • PicPay ✨
            • Mercado Pago ✨
            """)
        
        with st.expander("🚗 Apps Mobilidade"):
            st.markdown("""
            • Uber ✨
            • 99 ✨
            """)
        
        with st.expander("🍔 Apps Delivery"):
            st.markdown("""
            • iFood ✨
            • Rappi ✨
            """)
        
        st.success("✨ = Novo na V3.3!")
    
    # Main content
    st.markdown("---")
    
    col1, col2 = st.columns(2)
    
    with col1:
        nome_cliente = st.text_input(
            "👤 Nome Completo do Cliente",
            placeholder="Ex: João Silva Santos",
            help="Digite o nome completo para filtrar transferências familiares"
        )
    
    with col2:
        banco = st.text_input(
            "🏦 Banco ou App",
            placeholder="Ex: Caixa, Uber, iFood, Digio",
            help="Informe o nome do banco ou aplicativo"
        )
    
    st.markdown("### 📤 Upload de Extratos")
    
    uploaded_files = st.file_uploader(
        "Arraste os arquivos ou clique para selecionar",
        type=['pdf', 'png', 'jpg', 'jpeg'],
        accept_multiple_files=True,
        help="Formatos aceitos: PDF, PNG, JPG, JPEG"
    )
    
    if uploaded_files:
        st.markdown(f'<div class="info-box">📁 {len(uploaded_files)} arquivo(s) selecionado(s)</div>', unsafe_allow_html=True)
        
        for file in uploaded_files:
            st.text(f"✓ {file.name} ({file.size / 1024:.1f} KB)")
    
    st.markdown("---")
    
    # Botões
    col_btn1, col_btn2 = st.columns([3, 1])
    
    with col_btn1:
        processar = st.button("🚀 PROCESSAR EXTRATOS", type="primary")
    
    with col_btn2:
        st.markdown('<div class="reset-button">', unsafe_allow_html=True)
        if st.button("🔄 NOVA CONSULTA"):
            st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)
    
    if processar:
        
        # Validações
        if not nome_cliente or not banco:
            st.error("⚠️ Por favor, preencha o nome do cliente e o banco!")
            return
        
        if not uploaded_files:
            st.error("⚠️ Por favor, faça upload de pelo menos um extrato!")
            return
        
        # Processamento
        st.markdown("---")
        st.markdown("### 🔄 Processando...")
        
        progress_bar = st.progress(0)
        status_text = st.empty()
        
        todas_entradas = []
        erros = []
        
        for idx, file in enumerate(uploaded_files):
            
            status_text.text(f"📄 Processando: {file.name}...")
            progress = (idx + 1) / len(uploaded_files)
            progress_bar.progress(progress)
            
            try:
                # Lê arquivo
                file_bytes = file.read()
                file_type = file.type
                
                # Processa baseado no tipo
                if file_type == 'application/pdf':
                    conteudo = extrair_texto_pdf(file_bytes)
                elif file_type in ['image/jpeg', 'image/png', 'image/jpg']:
                    conteudo = processar_imagem(file_bytes)
                else:
                    erros.append(f"{file.name}: Tipo de arquivo não suportado")
                    continue
                
                # Analisa com Claude (COM STREAMING + AGRUPAMENTO!)
                st.info(f"🤖 Analisando {file.name} com Claude V3.3.3 (Agrupamento ativado)...")
                resposta = analisar_com_claude(conteudo, file_type, nome_cliente, banco)
                
                # Valida JSON
                dados, erro = validar_e_corrigir_json(resposta)
                
                if erro:
                    erros.append(f"{file.name}: {erro}")
                    continue
                
                if dados and 'entradas' in dados:
                    todas_entradas.extend(dados['entradas'])
                    st.success(f"✅ {file.name}: {len(dados['entradas'])} entradas encontradas")
                else:
                    erros.append(f"{file.name}: Nenhuma entrada válida encontrada")
            
            except Exception as e:
                erros.append(f"{file.name}: {str(e)}")
        
        progress_bar.progress(1.0)
        status_text.text("✅ Processamento concluído!")
        
        st.markdown("---")
        
        # Resultados
        if todas_entradas:
            
            # Calcula resumo
            valores = [e['valor'] for e in todas_entradas]
            resumo = {
                'total_entradas': len(todas_entradas),
                'valor_total': sum(valores),
                'maior_entrada': max(valores),
                'menor_entrada': min(valores),
                'media_mensal': sum(valores) / 3 if len(valores) > 0 else 0
            }
            
            dados_completos = {
                'tipo_fonte': 'MÚLTIPLOS_ARQUIVOS',
                'entradas': todas_entradas,
                'resumo': resumo,
                'observacoes': f'Análise consolidada de {len(uploaded_files)} arquivo(s)'
            }
            
            # Mostra resumo
            st.markdown('<div class="success-box">', unsafe_allow_html=True)
            st.markdown("### ✅ Análise Concluída!")
            
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric("Total de Entradas", resumo['total_entradas'])
            
            with col2:
                st.metric("Valor Total", f"R$ {resumo['valor_total']:,.2f}")
            
            with col3:
                st.metric("Média Mensal", f"R$ {resumo['media_mensal']:,.2f}")
            
            st.markdown('</div>', unsafe_allow_html=True)
            
            # Gera Excel
            st.markdown("### 📥 Download do Relatório")
            
            excel_file = criar_excel_profissional(dados_completos, nome_cliente, banco)
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"analise_renda_{nome_cliente.replace(' ', '_')}_{timestamp}.xlsx"
            
            col_download, col_reset = st.columns([3, 1])
            
            with col_download:
                st.download_button(
                    label="📊 BAIXAR RELATÓRIO EXCEL",
                    data=excel_file,
                    file_name=filename,
                    mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                )
            
            with col_reset:
                st.markdown('<div class="reset-button">', unsafe_allow_html=True)
                if st.button("🔄 REINICIAR", key="reset2"):
                    st.rerun()
                st.markdown('</div>', unsafe_allow_html=True)
            
            st.success("✅ Relatório pronto para download!")
        
        # Mostra erros
        if erros:
            st.markdown("---")
            st.markdown("### ⚠️ Avisos")
            for erro in erros:
                st.warning(erro)
        
        # Se nenhum resultado
        if not todas_entradas and not erros:
            st.error("❌ Nenhuma entrada válida encontrada nos arquivos processados.")
    
    # Footer - COM BRANDING MAGALHÃES
    st.markdown("---")
    st.markdown("""
    <div style='text-align: center; color: #666; padding: 20px;'>
        <p style='font-size: 1.1rem; font-weight: bold; color: #1f77b4; margin-bottom: 5px;'>
            By Magalhães Negócios
        </p>
        <p><strong>Analisador de Renda V3.3.3</strong> | Apps Agrupados por Dia</p>
        <p>Sistema profissional de análise de extratos bancários</p>
        <p style='font-size: 0.8rem; margin-top: 10px;'>
            Desenvolvido com ❤️ usando Streamlit + Claude Sonnet 4
        </p>
        <p style='font-size: 0.7rem; color: #999; margin-top: 5px;'>
            Powered by Anthropic AI
        </p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()
