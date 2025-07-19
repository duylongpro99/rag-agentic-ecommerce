import { HomeNavbar } from '@/components/home/navbar';

interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = ({ children }) => {
    return (
        <div className="flex flex-col gap-y-4 justify-center items-center min-h-screen">
            <HomeNavbar />
            {children}
        </div>
    );
};

export default HomeLayout;
