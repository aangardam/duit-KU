import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

export default function FormWrapper({
    children,
    overlayText = 'You Don’t Have Permission to this feature, please contact your administrator if you need access .',
    permission = true,
}: {
    children: React.ReactNode;
    overlayText?: string;
    permission?: boolean;
}) {
    return (
        <Card>
            <div className="relative">
                {!permission && (
                    <div className="absolute inset-0 backdrop-filter backdrop-blur-[2px] flex items-center justify-center z-20">
                        <div className="text-center max-w-[500px]">
                            <Badge variant={'secondary'} className="p-3">
                                <h2 className="text-sm font-semibold">
                                    {overlayText}
                                </h2>
                            </Badge>
                        </div>
                    </div>
                )}
                <CardContent className=" min-h-auto max-h-[60vh] overflow-y-auto space-y-5 relative z-10 ">
                    {children}
                </CardContent>
            </div>
        </Card>
    );
}
