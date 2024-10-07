const handleName = (name: string): string => {
    if (!name.includes("Proshow")){
        return name
    }
    let splitName = name.split("-");
    let newName = splitName[1];
    console.log(newName, name)
    return newName!;
}

export { handleName };