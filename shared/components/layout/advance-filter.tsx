import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
 } from "../ui/accordion"
import { Button } from "../ui/button";

interface PropTypes {   
    children: React.ReactNode;
    resetFilter?: () => void;
    includeAction?: boolean;
}
const AdvanceFilter = (props:PropTypes) => {
    const { children, resetFilter, includeAction = true } = props
    return (
        <div className="flex flex-col gap-4 mt-2">   
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Advance Filter</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-4">
                            {children}
                        </div>
                        {includeAction && (
                            <div className="col-span-full flex justify-end gap-4 mt-2">
                                <Button 
                                    variant="redGradient"
                                    type="button"
                                    className="px-6 cursor-pointer"
                                    onClick={resetFilter}
                                >
                                    Reset Filter
                                </Button>
                                <Button
                                    variant="primaryGradient"
                                    type="submit"
                                    className="px-6 cursor-pointer"
                                >
                                    Apply Filter
                                </Button>
                            </div>
                        )}
                        
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}   

export default AdvanceFilter