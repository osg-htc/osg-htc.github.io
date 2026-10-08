import Link from "@mui/material/Link";
import Icon from "@/components/Header/Icon";

const Title = () => (
	<Link href={"/"} display={'flex'} flexDirection={'row'} alignItems={'center'} gap={{lg: 3, xs: 1}}>
		<Icon />
	</Link>
)

export default Title;
