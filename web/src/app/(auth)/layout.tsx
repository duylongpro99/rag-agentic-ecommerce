interface Props {
    children: React.ReactNode;
}

const HomeLayout: React.FC<Props> = ({ children }) => {
    return <div className="flex flex-col w-full min-h-screen gap-y-4 justify-center items-center">{children}</div>;
};

export default HomeLayout;
