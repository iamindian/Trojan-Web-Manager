import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfinitLoader from "react-window-infinite-loader"
import useGetUsers from "../hooks/useGetUsers";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
function Users() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    // const [isNextPageLoading, setIsNextPageLoading] = useState(false);
    const isNextPageLoading = useRef(false);
    const [, getUsers] = useGetUsers();
    const total = useRef(1000);
    const hasNextPage = useRef(true);
    const isItemLoaded = index => index < users.length;
    const itemCount = hasNextPage.current ? users.length + 5 : users.length;
    const loadMoreItems = async (startIndex, stopIndex) => {
        if (isNextPageLoading.current) {
            return Promise.resolve();
        }
        isNextPageLoading.current = true;
        return new Promise(resolve => {

            getUsers(startIndex, (stopIndex - startIndex) + 1).then((resp) => {
                const rUsers = resp.data.users;
                total.current = resp.data.total;
                const joined = [...users, ...rUsers]
                if (joined.length === resp.data.total) {
                    hasNextPage.current = false;
                }
                setUsers(joined);
                isNextPageLoading.current = false;
                resolve();
            })


        })
    }
    const click = (id) => {
        navigate('/admin/' + id);
    }
    const Row = ({ index, style }) => {
        let label;
        style = Object.assign({}, style, { textAlign: "center" })
        if (isItemLoaded(index)) {
            const user = users[index];
            label = `Username: ${user.username} , Quota: ${user.quota} , Start: ${user.start} , Delta: ${user.delta}`;
        } else {
            label = "loading";
        }
        return (<div onClick={() => {
            click(users[index].id);
        }} className="List-item" style={style}>
            {label}
        </div>);
    };
    useEffect(() => {
        loadMoreItems(0, 10);
    }, [])
    return (<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

        <div style={{ height: "500px", width: "600px" }}>
            <Typography sx={{ fontSize: 20, textAlign: "center" }} color="text.secondary">
                Users
            </Typography>
            <AutoSizer>

                {({ height, width }) => (

                    <InfinitLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
                        {({ onItemsRendered, ref }) => (
                            <List
                                ref={ref}
                                className="List"
                                height={height}
                                itemCount={itemCount}
                                itemSize={50}
                                width={width}
                                onItemsRendered={onItemsRendered}
                            >
                                {Row}
                            </List>
                        )}
                    </InfinitLoader>

                )}

            </AutoSizer>
        </div>
    </div>);
}
export function Component() {
    return Users();
}
Component.displayName = "Users";