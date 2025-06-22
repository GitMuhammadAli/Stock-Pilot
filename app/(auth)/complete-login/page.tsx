// "use client";

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/providers/AuthProvider';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Loader2, CheckCircle, XCircle } from "lucide-react";

// export default function CompleteLoginPage() {
//   const router = useRouter();
//   // const { login } = useAuth();
//   const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
//   const [message, setMessage] = useState('Completing your login...');

//   useEffect(() => {
//     const completeLogin = async () => {
//       try {
//         const response = await fetch('/api/auth/user');
//         const data = await response.json();
        
//         if (data.authenticated) {
//           // login(data.token);
//           setStatus('success');
//           setMessage('Login successful! Redirecting to dashboard...');
          
//           setTimeout(() => {
//             router.push('/dashboard');
//           }, 1500);
//         } else {
//           throw new Error(data.message || 'Authentication failed');
//         }
//       } catch (error) {
//         setStatus('error');
//         setMessage(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
//         setTimeout(() => router.push('/login'), 3000);
//       }
//     };
    
//     completeLogin();
//   }, [router]);

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-bg-primary p-4">
//       <Card className="w-full max-w-md bg-bg-secondary border-none shadow-xl">
//         <CardHeader className="space-y-1">
//           <div className="flex justify-center mb-4">
//             <div className="bg-bg-tertiary p-3 rounded-full">
//               {status === 'loading' && <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />}
//               {status === 'success' && <CheckCircle className="h-10 w-10 text-status-success" />}
//               {status === 'error' && <XCircle className="h-10 w-10 text-status-error" />}
//             </div>
//           </div>
//           <CardTitle className="text-2xl font-bold text-primary text-center">
//             {status === 'loading' && 'Authenticating'}
//             {status === 'success' && 'Login Successful'}
//             {status === 'error' && 'Authentication Failed'}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center text-muted">
//             <p>{message}</p>
//             {status === 'loading' && (
//               <div className="mt-4 w-full bg-bg-tertiary rounded-full h-2.5">
//                 <div className="bg-brand-primary h-2.5 rounded-full animate-pulse w-full"></div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function CompleteLogin() {
  const router = useRouter();
  const { refreshAuth, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const handleLoginComplete = async () => {
      // Refresh auth state to get user data from cookie
      await refreshAuth();
      
      // Get redirect URL from session storage
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
      sessionStorage.removeItem('redirectAfterLogin');
      
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        router.push(redirectUrl);
      }, 100);
    };

    if (!isLoading) {
      handleLoginComplete();
    }
  }, [refreshAuth, router, isLoading]);

  return (
    <div className="flex h-screen bg-[#0B0F1A] text-white">
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#B6F400] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Completing login...</p>
        </div>
      </div>
    </div>
  );
}
