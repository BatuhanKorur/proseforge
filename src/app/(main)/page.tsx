import getDocuments from "@/actions/doc.actions";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default async function MainPage(){
    const docs = await getDocuments()
    if(!docs) return null

    if(docs.length === 0) {
        return (
            <p>No documents found</p>
        )
    }


    return (
        <div className="grid grid-cols-3 gap-5">
            {docs.map(doc => (
                    <Card key={doc.id}>
                        <CardHeader>
                            <CardTitle>{ doc.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Some content</p>
                        </CardContent>
                    </Card>
                ))
             }
        </div>
    )
}
