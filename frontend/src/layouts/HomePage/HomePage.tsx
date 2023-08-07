import { Carousel } from "./components/Carousel"
import { ExplorerTopBooks } from "./components/ExplorerTopBooks"
import { Heros } from "./components/Heros"
import { LibraryServices } from "./components/LibraryServices"

export const HomePage = () => {
    return (
        <>
            <ExplorerTopBooks />
            <Carousel />
            <Heros />
            <LibraryServices />
        </>
    )
}


