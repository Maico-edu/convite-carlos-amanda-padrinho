// Todo o conteúdo do convite fica aqui. Edite os textos sem mexer nos componentes.

export const invite = {
  groom: 'Carlos',
  bride: 'Amanda',

  // Topo da página
  welcome: 'Com alegria no coração, convidamos vocês',
  headline: 'Uma nova etapa da nossa história',
  tagline: 'Duas vidas, um mesmo caminho — e muito amor para construir juntos.',

  // Carta principal
  letter: {
    title: '💍 Um convite especial para nossos padrinhos e madrinhas',
    paragraphs: [
      {
        text: 'Temos um momento muito especial chegando em nossas vidas: o nosso casamento! E não poderíamos viver esse sonho sem pessoas tão especiais ao nosso lado.'
      },
      {
        text: 'Por isso, queremos fazer um convite cheio de carinho:',
        highlight: 'vocês aceitam ser nossos padrinhos e madrinhas de casamento? '
      },
      {
        text: 'Queremos compartilhar esse momento único com pessoas que são importantes para nós, que fazem parte da nossa história e que desejamos ter sempre por perto.'
      },
      {
        text: 'Será uma honra ter vocês ao nosso lado nesse dia tão especial, celebrando o nosso amor e o início de uma nova etapa das nossas vidas. '
      },
      {
        highlight: 'Com muito carinho, esperamos um sim de vocês! 🤍'
      }
    ],
    signoff: 'Com amor,'
  },

  // Datas e locais (já informados antes).
  showEvents: true,
  eventsTitle: 'Salve a data',
  ceremony: {
    title: 'Cerimônia',
    date: '02/01/2027',
    time: '17:00h',
    place: 'Igreja Católica De Naque',
    address: 'R. Antônio Alves de Lima, 70, Naque - MG, 35117-000'
  },
  dinner: {
    title: 'Jantar',
    date: '02/01/2027',
    time: '20:00h',
    place: 'Antigo Neneco',
    address: 'Rua Guiomar Soares Costa, nº 355, na saída para o Naquinho, na cidade de Naque'
  },

  // Versículo
  verse: {
    text: 'Melhor é serem dois do que um, porque têm melhor paga do seu trabalho.',
    reference: 'Eclesiastes 4:9',
    note: 'Que Deus esteja presente nessa união e que nunca faltem pessoas especiais para caminhar ao nosso lado.'
  },

  // A pergunta final
  question: {
    eyebrow: 'Um pedido do fundo do coração',
    intro: 'Agora, só falta uma perguntinha...',
    
    image: 'images/aliancas.jpg',
    imageAlt: 'Duas alianças douradas sobre uma fita de cetim, ao lado de gipsófila',
    text: 'Vocês aceitam ser nossos padrinhos e madrinhas de casamento? 💍🤍',
    subtext: 'Será uma honra ter vocês ao nosso lado nesse dia tão especial.',
    yes: 'Sim! ❤️',
    no: 'Não 🥺',
    escapeMessages: [
      'Eita, esse botão não vale! 😂',
      'Tem certeza mesmo? 🥹',
      'Pensa com carinho mais uma vez! ❤️',
      'Opa, você quase conseguiu! 🙈'
    ],
    accepted: 'Abrimos o WhatsApp com a sua mensagem pronta. É só revisar e enviar! 🤍',
    fallback: 'Não abriu? Toque aqui.'
  },

  whatsapp: {
    number: '+55 31 9089-6457',
    message:
      'Clarooo que eu aceito! 🥹❤️ Fico muito feliz por fazer parte desse momento tão especial na vida de vocês. Que Deus abençoe muito essa união! 💍🤍'
  },

  
  photos: {
    main: 'images/foto.pre.jpeg',
    gallery: ['images/f.jpeg', 'images/fot.jpeg', 'images/fo.jpeg']
  }
}
