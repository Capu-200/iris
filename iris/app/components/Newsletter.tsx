import { CalendarDaysIcon, HandRaisedIcon } from '@heroicons/react/24/outline'

export default function Newsletter() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div className="max-w-xl lg:max-w-lg">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-950">Rejoignez-nous !</h2>
            <p className="mt-4 text-lg text-gray-600">
            Chaque paire a une histoire. Abonnez-vous pour suivre nos engagements, nos choix de matériaux innovants et les actions sociales et environnementales que nous soutenons. 
            Une fois par mois, un condensé d’inspiration durable directement dans votre boîte mail
            </p>
            <div className="mt-6 flex max-w-md gap-x-4">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="Entrez votre adresse mail"
                autoComplete="email"
                className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                />
              <button
                type="submit"
                className="flex-none rounded-md bg-[#576F66] px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#34433D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34433D]"
              >
                Abonnez-vous
              </button>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-gray-200/75 p-2 ring-1 ring-white">
                <CalendarDaysIcon aria-hidden="true" className="size-6 text-gray-400" />
              </div>
              <dt className="mt-4 text-base font-semibold text-gray-900">Article mensuel</dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                Retrouvez nos articles mensuel pour suivre nos engagements, nos actions sociales et environnementales ainsi que de nouvelles marques de paires.
              </dd>
            </div>
            <div className="flex flex-col items-start">
              <div className="rounded-md bg-gray-200/75 p-2 ring-1 ring-white">
                <HandRaisedIcon aria-hidden="true" className="size-6 text-gray-400" />
              </div>
              <dt className="mt-4 text-base font-semibold text-gray-900">Pas de spam</dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                Nous respectons votre boîte mail autant que la planète, vous n'aurez donc pas de spam, seulement des actus responsables et inspirantes.
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#34433D] to-[#B6C1BD] opacity-30"
        />
      </div>
    </div>
  )
}
