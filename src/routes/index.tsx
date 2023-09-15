import {Routes, Route, Navigate} from 'react-router-dom';
import React, {lazy, Suspense} from 'react';

const withSuspense = (
    Com: React.LazyExoticComponent<(props: any) => JSX.Element> | React.LazyExoticComponent<React.FC<{}>>
) => {
    return (
        <Suspense fallback={null}>
            <Com />
        </Suspense>
    );
};

const routerConfig = [
    {
        path: '/',
        element: withSuspense(lazy(() => import('@/modules')))
    },
    {
        path: '/game',
        element: withSuspense(lazy(() => import('@/modules/gomoku/Game')))
    },
    {
        path: '/*',
        element: <Navigate to="/" />
    }
];

export const router = (
    <Routes>
        {routerConfig.map(router => {
            const {path, element} = router;
            return <Route path={path} element={element} />;
        })}
    </Routes>
);

// const routeChild = [
//     {
//         path: 'game',
//         element:
//     }
// ];

// export function createRouter() {
//     return createBrowserRouter(
//         [
//             {
//                 path: '/',
//                 element: <GameMenu />,
//                 children: [
//                     ...routeChild,
//                     {
//                         path: '*',
//                         element: <Navigate to="/" replace />
//                     }
//                 ]
//             }
//         ],
//         {
//             basename: 'gomoku'
//         }
//     );
// }
