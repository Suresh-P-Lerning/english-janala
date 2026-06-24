const synonyms = ["Bangla", "English", "Math", "Physics", "Chemistry"]

const loadSynonys =(synonyms)=>{
    const synonymsContainer = synonyms.map(synonym=>`<span class='btn'>${synonym}</span>`)
    return(synonymsContainer.join(' '))
}
loadSynonys(synonyms)