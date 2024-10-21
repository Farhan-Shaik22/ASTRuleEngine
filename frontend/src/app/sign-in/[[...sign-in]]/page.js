import {SignIn} from '@clerk/nextjs';

export default function SignInPage(){
    return (
        <div className='absolute inset-0 text-white font-bold px-4  text-3xl text-center md:text-5xl lg:text-8xl w-full min-h-screen flex items-center justify-center bg-transparent'>
            <div className='z-50 mt-10'>
                <SignIn></SignIn>
            </div>
        </div>
    );
}