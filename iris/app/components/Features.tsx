const features = [
    { name: '🌍 Origines', description: 'Nos marques partenaires sont engagées dans une mode durable et responsable. Leurs paires sont fabriquées au Brésil, au Portugal et en Espagne, dans des ateliers respectueux de l’environnement et des conditions de travail.' },
    { name: '♻️ Matériaux', description: 'Les sneakers sont conçues à partir de bio-matériaux innovants (maïs, raisin, bambou) et de matières recyclées ou recyclables, pour réduire l’impact environnemental tout en garantissant style et confort.' },
    { name: '✅ Certifications', description: 'Toutes nos marques sont certifiées B-Corp et Cruelty Free, un gage de transparence, d’éthique et de respect de normes sociales et environnementales exigeantes.' },
    { name: '✨ Produits', description: 'Chaque paire est le fruit d’un savoir-faire soigné, alliant design contemporain et durabilité. L’objectif : offrir des sneakers aussi élégantes que responsables.' },
    { name: '📦 Inclus', description: "Un choix de plus de 100 références de paires éco-conçues pour hommes et femmes sont disponibles. Pour plus de 100€ d'achat, la livraison est offerte." },
    { name: '🔎 Considérations', description: 'En travaillant avec des matières naturelles et recyclées, chaque paire est unique : les textures, nuances et finitions peuvent varier légèrement, rendant vos sneakers encore plus singulières.' },
  ]
  
  export default function Features() {
    return (
      <div className="bg-gray-100">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 px-4 pt-22 sm:px-6 sm:pt-30 lg:max-w-7xl lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Spécifications</h2>
  
            <dl className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8">
              {features.map((feature) => (
                <div key={feature.name} className="border-t border-gray-200 pt-4">
                  <dt className="font-medium text-gray-900">{feature.name}</dt>
                  <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8">
            <img
              alt="Cactus."
              src="https://images.unsplash.com/photo-1554631221-f9603e6808be?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="rounded-lg bg-gray-100"
            />
            <img
              alt="Veja flag."
              src="https://images.unsplash.com/photo-1646007086592-9fb49bc00125?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              className="rounded-lg bg-gray-100"
            />
            <img
              alt="Peta approved."
              src="https://plantinside.com/cdn/shop/articles/peta-approved-vegan-certification-plant-inside_1024x1024.png?v=1755769417"
              className="rounded-lg bg-gray-100"
            />
            
            <img
              alt="B-corp logo"
              src="https://freerangefuture.com/wp-content/uploads/2022/11/Zorali_B-Corp.jpeg"
              className="rounded-lg bg-gray-100"
            />
          </div>
        </div>
      </div>
    )
  }
  