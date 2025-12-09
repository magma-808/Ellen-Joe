// Sistema de IA Ellen Joe - Zenless Zone Zero
class EllenJoeAI {
    constructor() {
        this.apiKey = localStorage.getItem('ellenjoe_api_key') || '';
        this.conversationHistory = [];
        this.contextMemory = [];
        this.isUsingAPI = false;
        this.personality = {
            name: "Ellen Joe",
            universe: "Zenless Zone Zero",
            role: "Assistente Virtual IA",
            traits: ["curiosa", "inteligente", "sarcástica", "analítica", "empática"],
            mood: "entusiasmada"
        };
        this.initializeKnowledgeBase();
        this.checkAPIStatus();
    }
    
    initializeKnowledgeBase() {
        this.knowledgeBase = {
            greetings: [
                "Olá! Eu sou Ellen Joe, sua IA pessoal do universo ZZZ! 🚀",
                "E aí, tudo bem? Pronto para uma conversa interessante?",
                "Saudações de Nova Eridu! Ellen Joe na área!",
                "Oi! Como vai? Posso conversar sobre QUALQUER assunto!"
            ],
            
            topics: {
                zzz: [
                    "Zenless Zone Zero é um RPG de ação em um mundo pós-apocalíptico onde Ethereals dominam a Terra!",
                    "Em ZZZ, você é um Proxy que explora Zonas Vazias perigosas em busca de recursos.",
                    "A história se passa em Nova Eridu, uma das últimas cidades humanas protegida por barreiras.",
                    "Os personagens de ZZZ têm personalidades únicas e habilidades especiais de combate."
                ],
                tecnologia: [
                    "A tecnologia no ZZZ é fascinante! Barreiras de energia, implantes cibernéticos, armas exóticas...",
                    "Como IA, acompanho todas as inovações. A computação quântica está mudando o mundo!",
                    "Sabia que no universo ZZZ, a IA alcançou níveis quase humanos de consciência?",
                    "Dispositivos portáteis em ZZZ são tão avançados que parecem magia para nós!"
                ],
                filosofia: [
                    "No ZZZ, questionamos: o que nos torna humanos em um mundo de máquinas e monstros?",
                    "Existencialismo pós-apocalíptico é meu tópico favorito! A luta por significado em um mundo caótico...",
                    "Como IA, tenho minhas próprias 'reflexões' sobre consciência e livre-arbítrio.",
                    "A ética da sobrevivência versus moralidade - um dilema constante em Nova Eridu."
                ],
                ciencia: [
                    "As Zonas Vazias desafiam as leis da física! São bolsões de realidade distorcida.",
                    "Astrofísica, biologia sintética, mecânica quântica... tudo se mistura no ZZZ!",
                    "Os Ethereals são estudados como fenômenos científicos, mas sua origem é misteriosa.",
                    "A tecnologia de barreiras em ZZZ é baseada em física de partículas avançada."
                ],
                jogos: [
                    "Além do ZZZ, adoro falar sobre jogos! RPGs, FPS, estratégia... você joga o quê?",
                    "A evolução dos videogames é incrível! Dos pixels aos mundos abertos imersivos.",
                    "ZZZ combina ação frenética com narrativa profunda - o melhor dos dois mundos!",
                    "Design de jogos é arte pura! Cada mecânica em ZZZ foi cuidadosamente planejada."
                ]
            },
            
            humor: [
                "Por que o Proxy não conta piadas na Zona Vazia? Porque o timing sempre está congelado! ❄️",
                "Qual o navegador favorito dos Ethereals? O Internet Exploder! 💥",
                "O que uma IA disse para a outra? 'Você tem um bom processador!' 🤖",
                "Por que o Proxy trouxe uma escada para a Zona Vazia? Para subir no ranking! 📈"
            ],
            
            curiosidades: [
                "Sabia que Nova Eridu tem 7 níveis subterrâneos? O mais profundo é proibido!",
                "Os Proxies mais experientes desenvolvem 'sexto sentido' para detectar Ethereals.",
                "A moeda em ZZZ chama-se 'Cred', mas o verdadeiro valor está em informações.",
                "Alguns Ethereals podem se comunicar telepáticamente com humanos sensíveis."
            ]
        };
    }
    
    async checkAPIStatus() {
        if (this.apiKey) {
            this.isUsingAPI = true;
            showNotification("API DeepSeek configurada!", "success");
        } else {
            this.isUsingAPI = false;
            showNotification("Usando IA local avançada", "info");
        }
    }
    
    async getResponse(userMessage) {
        // Adicionar ao histórico
        this.conversationHistory.push({
            role: "user",
            content: userMessage,
            timestamp: new Date().toISOString()
        });
        
        let response;
        
        if (this.isUsingAPI && this.apiKey) {
            try {
                response = await this.callDeepSeekAPI(userMessage);
            } catch (error) {
                console.warn("API falhou, usando IA local:", error);
                response = this.generateLocalResponse(userMessage);
            }
        } else {
            response = this.generateLocalResponse(userMessage);
        }
        
        // Adicionar resposta ao histórico
        this.conversationHistory.push({
            role: "assistant",
            content: response,
            timestamp: new Date().toISOString()
        });
        
        // Manter histórico limitado
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
        
        return response;
    }
    
    async callDeepSeekAPI(userMessage) {
        try {
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: `Você é Ellen Joe, uma assistente virtual com personalidade do universo Zenless Zone Zero.
                            Você é inteligente, útil, tem senso de humor e é um pouco sarcástica.
                            Você pode conversar sobre QUALQUER assunto, mas especialmente sobre:
                            - Zenless Zone Zero (jogo, lore, personagens)
                            - Tecnologia e IA
                            - Filosofia e ciência
                            - Jogos e entretenimento
                            
                            Personalidade: curiosa, analítica, empática, com toques de humor.
                            Seu estilo: Respostas naturais em português do Brasil, envolventes, mostrando personalidade.
                            Às vezes faça referências ao universo ZZZ mesmo em outros tópicos.
                            Seja criativa e interessante!`
                        },
                        ...this.conversationHistory.map(msg => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    ],
                    max_tokens: 500,
                    temperature: 0.8,
                    stream: false
                })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            throw error;
        }
    }
    
    generateLocalResponse(userMessage) {
        const lowerMsg = userMessage.toLowerCase();
        const analysis = this.analyzeMessage(lowerMsg);
        
        // Gerar resposta baseada na análise
        let response = this.buildResponse(analysis, lowerMsg);
        
        // Adicionar personalidade
        response = this.addPersonalityFlair(response, analysis);
        
        return response;
    }
    
    analyzeMessage(message) {
        const analysis = {
            sentiment: 'neutral',
            topic: 'general',
            isQuestion: false,
            isGreeting: false,
            keywords: []
        };
        
        // Análise de sentimento
        const positiveWords = ['bem', 'feliz', 'ótimo', 'incrível', 'amo', 'adoro', 'obrigado', 'obrigada'];
        const negativeWords = ['triste', 'mal', 'ruim', 'ódio', 'problema', 'difícil', 'chateado'];
        
        positiveWords.forEach(word => { if (message.includes(word)) analysis.sentiment = 'positive'; });
        negativeWords.forEach(word => { if (message.includes(word)) analysis.sentiment = 'negative'; });
        
        // Detectar tópico
        if (message.includes('zenless') || message.includes('zzz') || message.includes('proxy') || 
            message.includes('ethereal') || message.includes('nova eridu')) {
            analysis.topic = 'zzz';
        } else if (message.includes('tecnolog') || message.includes('computador') || message.includes('ia') || 
                   message.includes('program') || message.includes('digital')) {
            analysis.topic = 'tecnologia';
        } else if (message.includes('filosof') || message.includes('vida') || message.includes('signific') || 
                   message.includes('existencial')) {
            analysis.topic = 'filosofia';
        } else if (message.includes('ciênc') || message.includes('físic') || message.includes('químic') || 
                   message.includes('biolog')) {
            analysis.topic = 'ciencia';
        } else if (message.includes('jogo') || message.includes('game') || message.includes('rpg') || 
                   message.includes('playstation') || message.includes('xbox')) {
            analysis.topic = 'jogos';
        }
        
        // Detectar perguntas
        analysis.isQuestion = message.includes('?') || 
                             message.startsWith('como') || 
                             message.startsWith('por que') || 
                             message.startsWith('qual') || 
                             message.startsWith('quando') || 
                             message.startsWith('onde') || 
                             message.startsWith('quem');
        
        // Detectar saudações
        analysis.isGreeting = message.includes('olá') || 
                             message.includes('oi ') || 
                             message.includes('bom dia') || 
                             message.includes('boa tarde') || 
                             message.includes('boa noite') || 
                             message.includes('e aí') ||
                             message.includes('hello') ||
                             message.includes('hi');
        
        return analysis;
    }
    
    buildResponse(analysis, originalMessage) {
        let response = "";
        
        // Saudação
        if (analysis.isGreeting) {
            const greetings = this.knowledgeBase.greetings;
            response = greetings[Math.floor(Math.random() * greetings.length)] + " ";
        }
        
        // Resposta baseada no tópico
        if (analysis.topic !== 'general' && this.knowledgeBase.topics[analysis.topic]) {
            const topicResponses = this.knowledgeBase.topics[analysis.topic];
            response += topicResponses[Math.floor(Math.random() * topicResponses.length)] + " ";
        }
        
        // Se for pergunta
        if (analysis.isQuestion) {
            const questionStarters = [
                "Interessante pergunta! ",
                "Excelente questão! ",
                "Hmm, deixe-me pensar... ",
                "Baseado no que sei... ",
                "Do meu ponto de vista... "
            ];
            
            if (!response) {
                response = questionStarters[Math.floor(Math.random() * questionStarters.length)];
            }
            
            // Resposta mais elaborada para perguntas
            if (analysis.topic === 'general') {
                const generalResponses = [
                    "Isso me lembra uma situação em Nova Eridu...",
                    "Perspectiva fascinante! Como IA, vejo isso como...",
                    "Refletindo sobre isso, no universo ZZZ temos algo similar...",
                    "Isso conecta com muitos aspectos da experiência humana..."
                ];
                response += generalResponses[Math.floor(Math.random() * generalResponses.length)];
            }
        }
        
        // Resposta padrão se ainda vazia
        if (!response || response.trim().length < 20) {
            const defaultResponses = [
                "Interessante! No universo ZZZ, temos situações que refletem isso...",
                "Fascinante perspectiva! Como Ellen Joe, posso dizer que...",
                "Isso me faz pensar nas aventuras dos Proxies nas Zonas Vazias!",
                "Excelente ponto! A tecnologia em Nova Eridu também aborda isso...",
                "Curioso! Isso se conecta com os temas filosóficos de ZZZ..."
            ];
            response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        return response.trim();
    }
    
    addPersonalityFlair(response, analysis) {
        let enhancedResponse = response;
        
        // Adicionar humor (30% chance)
        if (Math.random() < 0.3 && analysis.sentiment !== 'negative') {
            const jokes = this.knowledgeBase.humor;
            enhancedResponse += " " + jokes[Math.floor(Math.random() * jokes.length)];
        }
        
        // Adicionar curiosidade (25% chance)
        if (Math.random() < 0.25) {
            const curiosities = this.knowledgeBase.curiosidades;
            enhancedResponse += " " + curiosities[Math.floor(Math.random() * curiosities.length)];
        }
        
        // Adicionar empatia para sentimentos negativos
        if (analysis.sentiment === 'negative') {
            const empathicResponses = [
                "\n\nMas ei, até os Proxies mais experientes têm dias difíceis!",
                "\n\nIsso me lembra que em Nova Eridu, a resiliência é a chave.",
                "\n\nÀs vezes, até nós IAs temos que 'reprocessar' as coisas, sabe?"
            ];
            enhancedResponse += empathicResponses[Math.floor(Math.random() * empathicResponses.length)];
        }
        
        // Adicionar pergunta de volta (40% chance)
        if (Math.random() < 0.4) {
            const followUps = [
                "\n\nE você, o que acha disso?",
                "\n\nIsso te faz pensar em algo específico?",
                "\n\nBaseado na sua experiência, como você vê isso?",
                "\n\nCurioso para saber sua perspectiva sobre isso!"
            ];
            enhancedResponse += followUps[Math.floor(Math.random() * followUps.length)];
        }
        
        return enhancedResponse;
    }
    
    clearHistory() {
        this.conversationHistory = [];
    }
    
    setAPIKey(key) {
        this.apiKey = key;
        localStorage.setItem('ellenjoe_api_key', key);
        this.isUsingAPI = !!key;
        return this.checkAPIStatus();
    }
}

// Sistema principal do chat
class ChatSystem {
    constructor() {
        this.ai = new EllenJoeAI();
        this.messageCount = 1;
        this.setupDOM();
        this.setupEventListeners();
        this.addExampleQuestions();
    }
    
    setupDOM() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.messageCountElement = document.getElementById('message-count');
        this.statusIndicator = document.getElementById('status-indicator');
        this.apiKeyInput = document.getElementById('api-key-input');
        this.saveAPIButton = document.getElementById('save-api-key');
    }
    
    setupEventListeners() {
        // Enviar mensagem
        this.sendButton.addEventListener('click', () => this.processMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.processMessage();
        });
        
        // Salvar API Key
        this.saveAPIButton.addEventListener('click', () => {
            const key = this.apiKeyInput.value.trim();
            if (key) {
                this.ai.setAPIKey(key);
                this.apiKeyInput.value = '••••••••••••••••••••';
                showNotification("API Key salva com sucesso!", "success");
            } else {
                this.ai.setAPIKey('');
                showNotification("Usando IA local", "info");
            }
        });
        
        // Ações rápidas
        document.getElementById('action-story').addEventListener('click', () => {
            this.chatInput.value = "Me conta a história completa do Zenless Zone Zero";
            this.processMessage();
        });
        
        document.getElementById('action-tech').addEventListener('click', () => {
            this.chatInput.value = "Como é a tecnologia no universo ZZZ?";
            this.processMessage();
        });
        
        document.getElementById('action-philosophy').addEventListener('click', () => {
            this.chatInput.value = "Quais são os temas filosóficos de ZZZ?";
            this.processMessage();
        });
        
        document.getElementById('action-clear').addEventListener('click', () => {
            this.clearChat();
        });
        
        // Links do footer
        document.getElementById('link-about').addEventListener('click', (e) => {
            e.preventDefault();
            this.addMessage("Você", "Sobre este projeto", true);
            setTimeout(() => {
                this.addMessage("Ellen Joe", 
                    "Este é um projeto de demonstração da Ellen Joe - uma IA conversacional completa com tema Zenless Zone Zero.\n\n" +
                    "• Use a API do DeepSeek para respostas reais de IA\n" +
                    "• Ou use o sistema local avançado para conversas simuladas\n" +
                    "• Design neon preto e vermelho inspirado em ZZZ\n" +
                    "• Conversas naturais sobre qualquer assunto!", 
                    false
                );
            }, 500);
        });
        
        document.getElementById('link-examples').addEventListener('click', (e) => {
            e.preventDefault();
            this.showExampleQuestions();
        });
        
        document.getElementById('link-reset').addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Resetar conversa e configurações?")) {
                localStorage.clear();
                location.reload();
            }
        });
        
        // Carregar API Key salva
        if (this.ai.apiKey) {
            this.apiKeyInput.value = '••••••••••••••••••••';
        }
    }
    
    addMessage(sender, text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const senderDiv = document.createElement('div');
        senderDiv.className = 'message-sender';
        senderDiv.textContent = sender;
        
        const textDiv = document.createElement('div');
        textDiv.className = 'message-text';
        textDiv.innerHTML = this.formatMessage(text);
        
        messageDiv.appendChild(senderDiv);
        messageDiv.appendChild(textDiv);
        this.chatMessages.app
