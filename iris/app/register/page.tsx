import Image from "next/image";
import Logo from '@/public/Logo-vert.svg'

export default function Login() {
    return (
      <div className="h-full bg-gray-50">
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Image
              alt="Logo en forme de fleur"
              src={Logo}
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-950">Créez un compte !</h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6">
              <div>
                <label htmlFor="nom" className="block text-sm/6 font-medium text-gray-950">
                  Nom
                </label>
                <div className="mt-2">
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    autoComplete=""
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="prenom" className="block text-sm/6 font-medium text-gray-950">
                    Prénom
                </label>
                <div className="mt-2">
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    required
                    autoComplete=""
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-950">
                  Adresse mail
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-950">
                    Mot de passe
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-950 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-950 focus:outline-2 focus:-outline-offset-2 focus:outline-[#576F66] sm:text-sm/6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-[#576F66] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#34433D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#576F66]"
                >
                  Se connecter
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm/6 text-gray-400">
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="font-semibold text-[#576F66] hover:text-[#34433D]">
                Connectez-vous !
              </a>
            </p>
          </div>
        </div>
      </div>
    )
  }
  