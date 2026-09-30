import type { Post } from "@/types/post";

export const posts: Post[] = [
  {
    id: "seo-geo-aio",
    slug: "o-que-aprendi-sobre-seo-geo-e-aio",
    title: "O que aprendi sobre SEO, GEO e AIO construindo meu portfólio",
    date: "2026-09-29",
    excerpt:
      "O que aprendi aplicando SEO, GEO e AIO na construção do meu portfólio e organizando minha identidade profissional na internet.",
    content: `
# O que aprendi sobre SEO, GEO e AIO construindo meu portfólio

Opa!

Estou aqui para inaugurar oficialmente a aba de blog deste portfólio.

Uhuuuu! :D

Espero que ela não fique sem nenhum post depois de alguns dias, igual aconteceu com meu outro blog...

Mas vamos deixar o passado de lado e falar do presente.

Eu não sabia exatamente o que publicar aqui, mas precisava ter pelo menos um post para inaugurar a página. Então pensei: nada melhor do que falar sobre o próprio portfólio que você está vendo agora.

E falar sobre o quê, especificamente?

Sobre uma das coisas que mais trabalhei durante o desenvolvimento e que mais me chamou atenção: **SEO, GEO e AIO**.

Talvez você já conheça esses termos. Talvez não. E, sinceramente, eu também não comecei sabendo exatamente onde cada um se encaixava.

Eu já vinha estudando esses conceitos há algum tempo e tinha aplicado algumas dessas ideias em projetos de teste, mas nunca tinha parado para fazer isso de forma tão completa em uma página própria.

Como essa acabou sendo uma das partes mais interessantes do desenvolvimento deste portfólio, resolvi registrar um pouco do que aprendi e, principalmente, como fui aplicando essas ideias aqui.

---

## Por que me preocupei com isso?

Quando comecei a desenvolver este portfólio, eu não queria simplesmente criar uma página bonita com meus projetos.

Queria ter uma experiência mais próxima de publicar um site profissional de verdade, pensando não apenas na interface, mas também no que acontece por trás dela.

Uma das coisas que começou a me preocupar foi minha própria presença na internet.

Afinal, eu poderia ter um portfólio muito bem feito, mas de que adianta isso se ninguém consegue encontrá-lo?

Foi aí que comecei a aprofundar meus estudos sobre SEO e, posteriormente, conceitos relacionados a GEO e AIO.

A ideia deixou de ser apenas:

> "Quero que meu site apareça no Google."

E começou a se transformar em algo maior:

> "Quero que meu site seja encontrado, entendido e que as informações sobre mim estejam bem organizadas."

Então fui atrás de uma checklist para entender o que poderia aplicar no projeto.

E acabei chegando a alguns pontos principais:

- **SEO técnico e descoberta**
- **Estrutura e semântica do conteúdo**
- **Indexação e rastreamento**
- **Dados estruturados e relacionamento entre entidades**
- **Identidade e autoridade digital**
- **Otimização para mecanismos generativos (GEO)**
- **Estruturação de conteúdo para sistemas de IA (AIO)**
- **Representação estruturada da minha identidade profissional**

Não é exatamente uma lista pequena.

Mas também não é tão assustadora quanto parece. O interessante foi perceber como várias dessas coisas se conectam.

Então vamos por partes.

---

# 1. SEO técnico e descoberta

De forma simples, essa parte está relacionada a tornar o site **encontrável e compreensível para mecanismos de busca**.

Uma das primeiras coisas que fiz foi trabalhar os títulos e descrições das páginas.

### Títulos e descrições

O \`title\` é o título associado à página e pode aparecer, por exemplo, na aba do navegador e nos resultados de busca.

A \`meta description\` funciona como uma pequena descrição do conteúdo daquela página e pode aparecer abaixo do título nos resultados.

No meu caso, cada página possui informações próprias, e as páginas dinâmicas de projetos e posts também recebem seus próprios metadados.

A ideia é simples: em vez de deixar um mecanismo de busca tentar descobrir sozinho o que aquela página representa, eu forneço esse contexto diretamente.

### URLs organizadas

Também tomei cuidado com a estrutura das URLs.

Se uma página representa um projeto, por exemplo, faz muito mais sentido ter algo como:

\`/projetos/letterdrop\`

do que uma URL genérica ou difícil de interpretar.

Isso também se relaciona aos \`slugs\` que utilizo no projeto.

Cada projeto e cada post possui um identificador próprio que é utilizado para construir sua URL.

### URLs canônicas

A URL canônica serve para indicar qual é o endereço principal de determinado conteúdo.

É uma forma de dizer:

> "Se existirem diferentes formas de acessar esse conteúdo, esta é a URL que considero oficial."

Configurei isso nas páginas do meu portfólio para deixar essa informação explícita.

### robots.txt

O \`robots.txt\` é um arquivo que fornece instruções para os robôs dos mecanismos de busca.

No meu caso, configurei o site para permitir o rastreamento das páginas e também informei onde está localizado o sitemap.

Ou seja, basicamente:

> "Você pode rastrear meu site e o mapa das páginas está aqui."

### sitemap.xml

O sitemap é, literalmente, um mapa das páginas do site.

Ele contém as URLs que fazem parte do meu portfólio e que podem ser descobertas pelos mecanismos de busca.

E aqui apareceu uma parte que achei particularmente interessante.

Como os dados do portfólio estão estruturados em arrays tipados enquanto ainda estou utilizando mocks, e meus projetos e posts possuem \`slug\`, eu não precisei escrever manualmente cada URL no sitemap.

Em vez de fazer algo assim:

\`\`\`text
/projetos/letterdrop
/projetos/rapadura-clicker
/projetos/supportdesk
/projetos/pedeai
...
\`\`\`

eu simplesmente percorro meus projetos e utilizo o \`slug\` de cada um para gerar as URLs.

A ideia é basicamente:

\`\`\`text
para cada projeto:
    pegar o slug
    montar a URL
    adicionar ao sitemap
\`\`\`

E pronto.

Se eu adicionar um novo projeto aos dados, ele passa a fazer parte do sitemap automaticamente.

O mesmo princípio é utilizado para os posts.

Achei isso particularmente interessante porque transforma uma tarefa que poderia ser manual em algo que acompanha a própria estrutura da aplicação.

### Open Graph

Open Graph é outra parte que eu achei bem legal porque é algo que aparece diretamente quando você compartilha um link.

Sabe quando você manda uma página para alguém e aparece uma imagem, um título e uma descrição junto do link?

É isso.

No meu portfólio, configurei essas informações para definir como as páginas podem ser apresentadas quando compartilhadas.

Além de deixar o link mais reconhecível, isso ajuda a dar uma identidade visual para o conteúdo fora do próprio site.

Inclusive, minha imagem atual de Open Graph ainda não é exatamente como eu gostaria. Ela foi feita com IA e está na minha lista de coisas para melhorar. :D

Para analisar essa parte, também utilizei o [OpenGraph.to](https://www.opengraph.to/pt), que achei uma ferramenta bem interessante para verificar como essas informações estão sendo interpretadas.

### Google Search Console

E então chegamos ao Google Search Console.

Ele é uma ferramenta que permite acompanhar como o Google está enxergando o site.

Para utilizá-lo, precisei verificar que o site realmente pertence a mim. Depois disso, pude enviar o sitemap e utilizar a ferramenta para testar URLs.

Uma coisa interessante foi perceber que "meu site funciona" e "o Google já encontrou e indexou meu site" são coisas completamente diferentes.

Em determinado momento, fiz uma inspeção da URL e o Google ainda não reconhecia aquela página.

Depois, o sitemap foi processado e passou a mostrar 29 páginas encontradas.

Também fiz o teste de URL e o Search Console informou que a página estava disponível para o Google e podia ser indexada.

Ainda estou esperando o restante desse processo acontecer naturalmente, mas foi interessante acompanhar isso acontecendo em um site que eu mesmo construí.

---

# 2. Estrutura e semântica do conteúdo

Depois da parte mais técnica de descoberta, vem uma questão mais relacionada à forma como o conteúdo é organizado.

### Páginas individuais

Uma coisa que considero importante em um portfólio é não colocar absolutamente tudo em uma única página.

Por isso, meus projetos possuem páginas próprias.

Em vez de ter apenas um card dizendo "LetterDrop", existe uma página específica para o projeto, com suas informações, tecnologias, imagens e outras seções.

O blog segue a mesma ideia.

Existe uma página para listar os posts e cada publicação possui sua própria URL.

Isso também ajuda a manter cada conteúdo bem definido dentro da estrutura do site.

### Conteúdo textual estruturado

Outra coisa importante foi não depender apenas do visual.

As informações do meu portfólio estão organizadas em diferentes estruturas: projetos, tecnologias, experiências, formação e posts.

Dentro de um projeto, por exemplo, existem informações específicas sobre o que ele é, quais tecnologias foram utilizadas e quais foram os principais aspectos do desenvolvimento.

É basicamente a mesma lógica que estou utilizando neste post: separar um assunto grande em partes menores e relacionadas.

---

# 3. Indexação e rastreamento

Essa parte é um pouco mais específica.

Aqui estamos falando de como os mecanismos de busca **encontram e analisam as páginas**.

### Rastreamento

Rastreamento é o processo em que os robôs de um mecanismo de busca acessam as páginas de um site para conhecê-las.

O \`robots.txt\`, o sitemap e uma estrutura de URLs organizada ajudam nesse processo.

### Indexação

Depois de encontrar e analisar uma página, o mecanismo de busca pode adicioná-la ao seu índice.

É isso que permite que ela apareça nos resultados de pesquisa.

E essa foi uma distinção que ficou bem mais clara para mim durante o desenvolvimento:

> Uma página existir na internet não significa que ela já esteja indexada.

### Sitemap enviado ao Google

Por isso também enviei meu sitemap pelo Search Console.

Assim, além de disponibilizar o sitemap publicamente, eu informei diretamente ao Google onde encontrar esse mapa das páginas.

---

# 4. Dados estruturados e relacionamento entre entidades

Essa foi provavelmente uma das partes que mais me interessou.

É uma área um pouco mais técnica, mas dá para explicar de forma simples.

## JSON-LD

JSON-LD é uma forma de fornecer informações estruturadas sobre uma página.

Uma maneira simples de pensar nisso é:

> o HTML apresenta o conteúdo para quem está acessando a página, enquanto o JSON-LD ajuda a descrever esse conteúdo de uma maneira que máquinas conseguem interpretar.

No meu projeto, utilizei JSON-LD para representar diferentes tipos de informação.

E aqui entram os schemas.

### Person

O \`Person\` representa a pessoa por trás do site: eu.

Nele consigo representar informações como meu nome, profissão, descrição, links associados e outros dados relevantes.

Como os dados do portfólio são estruturados, algumas dessas informações podem ser geradas a partir dos próprios dados que utilizo no site.

Isso significa que, conforme minhas informações forem evoluindo, a representação também pode acompanhar essas mudanças.

### WebSite

O \`WebSite\` representa o próprio site.

É uma forma de fornecer contexto de que aquela estrutura corresponde a um site específico, com seu nome, URL e outras informações.

### ProfilePage

O \`ProfilePage\` representa uma página cujo foco principal é um perfil.

No meu caso, isso combina diretamente com a proposta do portfólio: apresentar quem eu sou profissionalmente.

### CollectionPage

O \`CollectionPage\` representa páginas que funcionam como coleções de conteúdo.

No meu portfólio, isso se aplica, por exemplo, às páginas que reúnem meus projetos e meus posts.

Assim, existe uma diferença entre:

> "esta página é um projeto"

e:

> "esta página é uma coleção de projetos."

### BreadcrumbList

Essa aqui é fácil de visualizar.

Lembra da história de João e Maria, que deixavam uma trilha para conseguir encontrar o caminho de volta?

É mais ou menos essa ideia.

Só que, em vez de migalhas de pão, temos uma estrutura indicando o caminho dentro do site.

Por exemplo:

\`\`\`text
Home
  ↓
Projetos
  ↓
Rapadura Clicker
\`\`\`

Isso ajuda a representar a hierarquia daquela página.

### BlogPosting

Esse schema é utilizado para representar uma publicação de blog.

Ou seja, ele ajuda a deixar explícito que determinada página representa um post, e não simplesmente uma página qualquer.

E, como minhas páginas de post são geradas dinamicamente, essa informação também é gerada a partir dos próprios dados da publicação.

### Schema de projetos

Também criei uma representação específica para meus projetos.

Dependendo do projeto, ele pode ser representado como \`WebApplication\` ou \`CreativeWork\`.

A lógica é simples:

se o projeto possui uma aplicação publicada, utilizo \`WebApplication\`.

Se não possui uma \`liveUrl\`, utilizo \`CreativeWork\`.

Assim, o tipo de informação fornecida acompanha o próprio projeto.

### Relacionamento entre entidades

E aqui chegamos à parte que mais me fez pensar sobre tudo isso.

Não é apenas:

\`\`\`text
David existe
Rapadura Clicker existe
Godot existe
\`\`\`

É possível representar relações entre essas informações:

\`\`\`text
David
  ↓ desenvolveu
Rapadura Clicker
  ↓ utiliza
Godot
\`\`\`

Isso começa a transformar as informações em uma espécie de rede de relações.

E, no meu caso, boa parte disso é gerada a partir dos próprios dados do portfólio.

---

# 5. Identidade e autoridade digital

Aqui comecei a perceber que tudo isso não estava servindo apenas para "otimizar uma página".

Também estava ajudando a construir uma identidade profissional na internet.

### Identificação clara do autor

Meu site deixa claro quem está por trás do conteúdo.

Existe uma pessoa associada aos projetos, aos textos e às informações apresentadas.

Essa relação também aparece nos dados estruturados.

### Identificação da profissão

Para um portfólio profissional, também é importante deixar claro não apenas quem é a pessoa, mas o que ela faz.

No meu caso:

**David Ericson → Desenvolvedor Fullstack**

Essa associação ajuda a dar contexto para todo o restante do conteúdo.

### Experiências e formação

Depois entram outras informações que tornam esse perfil mais completo:

- experiências;
- formação;
- tecnologias;
- projetos;
- conhecimentos.

É como se cada camada adicionasse um pouco mais de contexto.

Primeiro existe uma pessoa.

Depois sabemos sua profissão.

Depois suas experiências.

Depois sua formação.

Depois suas tecnologias e projetos.

Aos poucos, aquele perfil começa a ficar muito mais completo.

### GitHub e LinkedIn

Também não queria que meu portfólio fosse uma identidade isolada.

Eu já existo em outros lugares da internet.

Por isso, associei meu GitHub e meu LinkedIn ao meu perfil através do campo \`sameAs\` no schema \`Person\`.

A ideia é deixar explícito que esses perfis representam a mesma pessoa.

Assim:

\`\`\`text
David Ericson
   ├── Portfolio
   ├── GitHub
   └── LinkedIn
\`\`\`

---

# 6. GEO - otimização para mecanismos generativos

Aqui entramos em um conceito mais recente e que pode ser encontrado com diferentes definições dependendo da fonte.

No contexto em que estou utilizando o termo, GEO está relacionado à preocupação em tornar um conteúdo mais compreensível para mecanismos que utilizam modelos generativos para produzir respostas.

E, olhando para tudo o que fiz anteriormente, percebi que várias dessas práticas também contribuem para isso.

Se eu digo apenas:

> "LetterDrop"

existe pouco contexto.

Mas se eu forneço:

> "LetterDrop é uma plataforma de newsletters construída com NestJS e microsserviços, utilizando RabbitMQ..."

e ainda relaciono esse projeto ao autor, às tecnologias, ao repositório e às demais informações disponíveis, existe muito mais contexto para ser interpretado.

Foi aí que comecei a enxergar os dados estruturados e toda essa organização de outra maneira.

Não estava apenas dizendo ao Google quais páginas existem.

Estava tentando tornar mais explícito **o que cada informação representa e como ela se relaciona com as outras**.

---

# 7. AIO - estruturação de conteúdo para sistemas de IA

Aqui também vale uma observação: AIO é uma sigla utilizada com diferentes significados dependendo do contexto.

Neste projeto, estou usando o termo para representar a preocupação em deixar as informações do site mais compreensíveis e contextualizadas para sistemas de IA.

A aplicação mais explícita disso foi a criação do \`llms.txt\`.

## llms.txt

Criei um arquivo \`llms.txt\` com informações resumidas sobre o site, meu perfil e meus principais conteúdos.

A ideia é disponibilizar uma fonte de contexto mais direta sobre o que existe no site.

Além disso, várias decisões que já mencionei também contribuem para esse objetivo:

- informações explícitas sobre os projetos;
- informações explícitas sobre mim;
- tecnologias relacionadas aos projetos;
- formação e experiências;
- dados estruturados;
- conteúdo textual;
- relações entre diferentes informações.

Até algumas decisões de acessibilidade acabam sendo interessantes nesse contexto.

Por exemplo, na seção de tecnologias da minha página inicial existem elementos visuais que representam as tecnologias. Esses elementos possuem informações textuais associadas, inclusive para tecnologias assistivas.

Isso significa que uma informação que poderia ser percebida apenas visualmente também possui uma representação textual.

Não fiz isso exclusivamente pensando em IA, acessibilidade é uma preocupação própria e importante, mas é interessante perceber como uma informação bem descrita pode ser útil para diferentes tipos de sistemas.

---

# 8. Representação estruturada da minha identidade profissional

E acho que essa foi a principal ideia que ficou na minha cabeça depois de todo esse processo.

No final, tudo começa a se conectar:

\`\`\`text
David Ericson
    ↓
é desenvolvedor Fullstack
    ↓
possui experiências
    ↓
possui formação
    ↓
conhece determinadas tecnologias
    ↓
desenvolveu determinados projetos
    ↓
possui repositórios desses projetos
    ↓
escreve sobre determinados assuntos
\`\`\`

E isso existe em diferentes camadas do meu portfólio:

na interface,

nos conteúdos,

nas URLs,

nos metadados,

nos dados estruturados,

no sitemap,

no \`llms.txt\`

e nos relacionamentos entre essas informações.

Foi aí que uma chave virou na minha cabeça.

Eu comecei este projeto pensando em construir um portfólio.

Mas, no processo, comecei a enxergá-lo como algo um pouco maior:

**uma representação pública e estruturada da minha identidade profissional na internet.**

---

## E é basicamente isso

Esse foi um dos assuntos que mais me divertiu estudar durante o desenvolvimento deste portfólio.

Eu já conhecia alguns desses conceitos antes, mas aplicá-los juntos em um projeto próprio fez com que eu entendesse muito melhor como eles se relacionam.

Também achei particularmente interessante perceber que existe toda uma camada acontecendo por baixo da página que normalmente não aparece para quem está navegando.

Você olha para o site e vê textos, imagens, projetos e animações.

Enquanto isso, por trás existem metadados, URLs, schemas, relacionamentos, sitemap, arquivos de contexto e várias outras informações descrevendo aquele mesmo conteúdo.

No fim, acho que essa foi a principal coisa que tirei desse estudo:

> **Construir um site não é apenas decidir o que aparece na tela. Também é decidir como esse conteúdo pode ser descoberto, interpretado e relacionado.**

E foi justamente essa parte "por baixo dos panos" que tornou esse projeto muito mais interessante para mim.

Esse foi o primeiro post.

Agora espero não abandonar o blog depois de uma semana. :D

Valeu!
`,
  },
];

export function getAllPosts(): Post[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function formatPostDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;

  return Math.max(1, Math.ceil(words / wordsPerMinute));
}