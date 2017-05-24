using EmitMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace luofu_InterestShare.Common
{
    public class MapperUtil
    {
        private static IMapper _mapper;
        public static IMapper GetMapper()
        {
            return _mapper ?? (_mapper = new MapperImpl());
        }
    }

    public class MapperImpl : IMapper
    {
        public TDestination Map<TSource, TDestination>(TSource tSource)
        {
            if (tSource == null)
                return default(TDestination);

            var mapper = ObjectMapperManager.DefaultInstance.GetMapper<TSource, TDestination>();
            return mapper.Map(tSource);
        }

        public TDestination Map<TSource, TDestination>(TSource tSource, IMappingConfigurator configs = null)
        {
            if (tSource == null)
                return default(TDestination);

            var mapper = ObjectMapperManager.DefaultInstance.GetMapper<TSource, TDestination>(configs);

            return mapper.Map(tSource);
        }

        public IEnumerable<TDestination> MapperGeneric<TSource, TDestination>(IEnumerable<TSource> tSources)
        {
            if (tSources == null)
                return null;

            IList<TDestination> tDestinations = new List<TDestination>();
            foreach (var tSource in tSources)
            {
                tDestinations.Add(Map<TSource, TDestination>(tSource));
            }
            return tDestinations;
        }

        public IList<TDestination> MapperGeneric<TSource, TDestination>(IList<TSource> tSources)
        {
            if (tSources == null)
                return null;

            IList<TDestination> tDestinations = new List<TDestination>();
            foreach (var tSource in tSources)
            {
                tDestinations.Add(Map<TSource, TDestination>(tSource));
            }
            return tDestinations;
        }
    }


    public interface IMapper
    {
        TDestination Map<TSource, TDestination>(TSource tSource);

        IEnumerable<TDestination> MapperGeneric<TSource, TDestination>(IEnumerable<TSource> tSources);
        IList<TDestination> MapperGeneric<TSource, TDestination>(IList<TSource> tSources);
    }
}
