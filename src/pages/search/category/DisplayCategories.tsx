//sert juste au formatage des catégories. Les noms sont en bleus et la séparation en noir
export default function DisplayCategories(props: { categories: string[] }) {
    return (
        <>
            {props.categories.map((i, index) => {
                return <span key={index} className="text-blue-800">
                    {i}
                    {
                        index != props.categories.length - 1 &&
                        <span className="text-black"> + </span>
                    }
                </span>
            })}
        </>
    )
}